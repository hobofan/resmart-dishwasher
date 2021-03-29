use std::path::{PathBuf};
use std::{fs, io};
use duct::cmd;
use chrono::{DateTime, Utc};
use clap::{Arg, App, ArgMatches};

fn take_image(config: &ArgMatches) -> PathBuf {
    let now: DateTime<Utc> = Utc::now();
    let timestamp = now.format("%FT%H%M%S");
    let output_path = PathBuf::from(config.value_of("outdir").unwrap()).join(&format!("{}.jpg", timestamp));
    cmd!("raspistill", "--rotation", "90", "-o", &output_path).run().expect("Failed to run raspistill");

    output_path
}

fn mqtt_publish_image(config: &ArgMatches, filepath: &PathBuf) {
    let mqtt_host = config.value_of("mqtthost").unwrap();
    let topic = "home/kitchen/dishwasher/camera";
    cmd!("mosquitto_pub", "-h", mqtt_host, "-t", topic, "-f", &filepath, "-r").run().expect("Failed to publish to MQTT");
}

fn remove_old_images(config: &ArgMatches) {
    let mut filenames = fs::read_dir(config.value_of("outdir").unwrap()).unwrap()
        .map(|res| res.map(|e| e.path()))
        .collect::<Result<Vec<_>, io::Error>>().unwrap();

    filenames.sort();
    let files_to_remove = filenames
        .iter()
        .rev()
        .skip(
            (config
                .value_of("max-images")
                .unwrap()
                .parse::<u32>()
                .expect("max-images value is not a number")
            - 1u32) as usize
            );

    for file in files_to_remove {
        fs::remove_file(file).expect("Unable to remove file");
    }
}

fn main() {
    let matches = App::new("imager")
                    .arg(Arg::with_name("outdir")
                        .long("outdir")
                        .value_name("DIRECTORY")
                        .help("Sets the output directory for the images")
                        .takes_value(true)
                        .required(true)
                    )
                    .arg(Arg::with_name("max-images")
                        .long("maximages")
                        .value_name("NUM_IMAGES")
                        .help("Sets the number of images that will be kept in the output directory")
                        .takes_value(true)
                        .default_value("2000")
                    )
                    .arg(Arg::with_name("mqtthost")
                        .long("mqtthost")
                        .value_name("HOSTNAME")
                        .help("Sets the hostname / ip address of the MQTT broker to publish to")
                        .takes_value(true)
                        .default_value("homepi")
                    )
                    .get_matches();

    remove_old_images(&matches);
    let new_image_path = take_image(&matches);
    mqtt_publish_image(&matches, &new_image_path);
}

use <rpi3-case.scad>;
use <camera_holder.scad>;

union() {
    lid();
    translate([-27, 57, 19.8]) {
        rotate([0, 0, -90]) {
            camera_holder();
        }
    }
}
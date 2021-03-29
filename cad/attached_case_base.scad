use <rpi3-case.scad>;
use <dishwasher_attachment.scad>;

union() {
    base();
    translate([23.5,0,2]) {
        rotate([0, 90, 0]) {
            attachment();
        }
    }
}
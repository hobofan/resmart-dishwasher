/// Camera holder piece for a Raspberry PI camera module (non-HQ)
$fn=20;

// height is along the axis of the camera connector
camera_board_height = 25;
camera_board_width = 25;

mounting_holes_radius = 1.5;
// Shared x offset by outer and inner mounting holes
mounting_holes_x_offset = 2;
mounting_holes_y_offset_outer = 2;
mounting_holes_y_offset_inner = 15;

camera_holder_depth = 3;
// Padding per x and y side
// (e.g. padding of 2 will result in total padding of 4 along the axis)
camera_holder_padding = 2;

camera_holder();

module camera_holder() {
    difference(){
        translate([-camera_holder_padding, -camera_holder_padding, 0]){
            cube([
                camera_board_height + camera_holder_padding * 2,
                camera_board_width + camera_holder_padding * 2,
                camera_holder_depth,
            ]);
        }
        mounting_holes();
    }
}

module mounting_holes() {
    translate([mounting_holes_x_offset, mounting_holes_y_offset_outer, -camera_holder_depth]) {
            cylinder(h=camera_holder_depth * 3, r=mounting_holes_radius);

    }
    translate([camera_board_height - mounting_holes_x_offset, mounting_holes_y_offset_outer, -camera_holder_depth]) {
            cylinder(h=camera_holder_depth * 3, r=mounting_holes_radius);

    }
    translate([mounting_holes_x_offset, mounting_holes_y_offset_inner, -camera_holder_depth]) {
            cylinder(h=camera_holder_depth * 3, r=mounting_holes_radius);

    }
    translate([camera_board_height - mounting_holes_x_offset, mounting_holes_y_offset_inner, -camera_holder_depth]) {
            cylinder(h=camera_holder_depth * 3, r=mounting_holes_radius);

    }
}
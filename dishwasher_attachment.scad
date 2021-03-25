dishwasher_door_depth = 48;
dishwasher_door_inner_gap = 2;
dishwasher_door_inner_gap_height = 10;
dishwasher_door_upper_gap = 2;

diswasher_cover_depth = 3;

outside_wall_thickness = 2;
outside_wall_height = 113;

width = 10;
bottom_overhang_offset = 10;

// Model the dishwasher "door" so we can substract it from the model
module door(depth) {
    union() {
        cube([depth, outside_wall_height, width]);
        magic_offset_number = 2;
        translate([magic_offset_number, dishwasher_door_inner_gap_height, 0])
            cube([depth, outside_wall_height, width]);

    }
};

// We are going to use this for both the top and bottom overhang
module overhang(depth) {
    difference() {
        cube([
            outside_wall_thickness + depth + dishwasher_door_upper_gap,
            outside_wall_height,
            width
        ]);
        translate([outside_wall_thickness, dishwasher_door_upper_gap, 0])
            door(depth);
    }
}

// Overhang that goes over the top of the door and to the inside gap
module top_overhang() {
    overhang(dishwasher_door_depth);
}

module bottom_overhang() {
    mirror([0, 1, 0])
    // TODO: distance variable
    translate([0,-outside_wall_height,bottom_overhang_offset])
        overhang(diswasher_cover_depth);
}

top_overhang();
bottom_overhang();

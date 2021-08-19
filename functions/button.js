const Rotary = require('raspberrypi-rotary-encoder');

    // WARNING ! This is WIRINGPI pin numerotation !! please see https://fr.pinout.xyz/pinout/wiringpi#*
    const pinClk = 10;
    const pinDt = 12;
    const pinSwitch = 8;  // Optional switch

    const rotary = new Rotary(pinClk, pinDt, pinSwitch);

    rotary.on("rotate", (delta) => {
      console.log("Rotation :"+delta);
    });
    rotary.on("pressed", () => {
      console.log("Rotary switch pressed");
    });
    rotary.on("released", () => {
      console.log("Rotary switch released");
    });
#!/bin/sh

'use strict'

var fs = require("fs");
var path = require("path");
var root = "/home/unal/Documents/otsimo/core-drawing-game";
console.log(root)

function updateJson(filepath, callback) {
  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    let obj = JSON.parse(data);
    callback(obj, function () {
      let out = JSON.stringify(obj, null, 4);
      fs.writeFile(filepath, out, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + filepath);
        }
      });
    })
  });
}

let inputPath = path.join(root, "src", "data", "sample.json");

/*
updateJson(path.join(root, "src", "data", "tr.json"), function (obj, done) {
  obj.preload.push({
    name: "back_pattern",
    type: "image",
    path: "img/back_pattern.png"
  })
  obj.custom_announce_color = ""
  obj.background_image = "back_pattern"
  obj.decoration = []
  if (process.argv[2].indexOf("match") > -1) {
    obj.preload.push({
      name: "stroke",
      type: "image",
      path: "img/stroke.png"
    })
    obj.decoration.push({
      "image": "stroke",
      "anchor": {
        "x": 0.5,
        "y": 0.5
      },
      "x": {
        "multiplier": 0.3,
        "constant": 0
      },
      "y": {
        "multiplier": 0.5,
        "constant": 0
      }
    })
  }
  obj.play_background_color = obj.loadingBackground;
  obj.home_background_color = obj.loadingBackground;
  obj.over_background_color = obj.loadingBackground;
  done()
})
*/

updateJson(path.join(root, "src", "data", "sample.json"), function (obj, done) {
  let starts = [
    "kelimesi_a_harfi_ile_baslar",
    "kelimesi_b_harfi_ile_baslar",
    "kelimesi_c_harfi_ile_baslar",
    "kelimesi_c-_harfi_ile_baslar",
    "kelimesi_d_harfi_ile_baslar",
    "kelimesi_e_harfi_ile_baslar",
    "kelimesi_f_harfi_ile_baslar",
    "kelimesi_g_harfi_ile_baslar",
    "kelimesi_g-_harfi_ile_baslar",
    "kelimesi_h_harfi_ile_baslar",
    "kelimesi_i-_harfi_ile_baslar",
    "kelimesi_i_harfi_ile_baslar",
    "kelimesi_j_harfi_ile_baslar",
    "kelimesi_k_harfi_ile_baslar",
    "kelimesi_l_harfi_ile_baslar",
    "kelimesi_m_harfi_ile_baslar",
    "kelimesi_n_harfi_ile_baslar",
    "kelimesi_o_harfi_ile_baslar",
    "kelimesi_o-_harfi_ile_baslar",
    "kelimesi_p_harfi_ile_baslar",
    "kelimesi_r_harfi_ile_baslar",
    "kelimesi_s_harfi_ile_baslar",
    "kelimesi_s-_harfi_ile_baslar",
    "kelimesi_t_harfi_ile_baslar",
    "kelimesi_u_harfi_ile_baslar",
    "kelimesi_u-_harfi_ile_baslar",
    "kelimesi_v_harfi_ile_baslar",
    "kelimesi_y_harfi_ile_baslar",
    "kelimesi_z_harfi_ile_baslar"
  ];

  let lets = [
    "hadi_a_harfini_cizelim",
    "hadi_b_harfini_cizelim",
    "hadi_c_harfini_cizelim",
    "hadi_c-_harfini_cizelim",
    "hadi_d_harfini_cizelim",
    "hadi_e_harfini_cizelim",
    "hadi_f_harfini_cizelim",
    "hadi_g_harfini_cizelim",
    "hadi_g-_harfini_cizelim",
    "hadi_h_harfini_cizelim",
    "hadi_i-_harfini_cizelim",
    "hadi_i_harfini_cizelim",
    "hadi_j_harfini_cizelim",
    "hadi_k_harfini_cizelim",
    "hadi_l_harfini_cizelim",
    "hadi_m_harfini_cizelim",
    "hadi_n_harfini_cizelim",
    "hadi_o_harfini_cizelim",
    "hadi_o-_harfini_cizelim",
    "hadi_p_harfini_cizelim",
    "hadi_r_harfini_cizelim",
    "hadi_s_harfini_cizelim",
    "hadi_s-_harfini_cizelim",
    "hadi_t_harfini_cizelim",
    "hadi_u_harfini_cizelim",
    "hadi_u-_harfini_cizelim",
    "hadi_v_harfini_cizelim",
    "hadi_y_harfini_cizelim",
    "hadi_z_harfini_cizelim"
  ];

  for (let i of starts) {
    let p = "audio/soundc/" + i + ".mp3";
    obj.preload.push({
      "name": i,
      "type": "audio",
      "path": p
    });
  }

  return done();
})



// Version
/*
updateJson(path.join(root, "otsimo.json"), function (obj, done1) {
  obj.version = "1.3.0";
  updateJson(path.join(root, "package.json"), function (pdata, done2) {
    pdata.version = obj.version;
    done2()
    done1()
  })
})




updateJson(path.join(root, "src", "data", "tr.json"), function (data, done) {
  data.game.hint_hand_match_duration = 900;
  done()
})


*/

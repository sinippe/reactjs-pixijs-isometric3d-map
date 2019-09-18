# Isometric 3D Map

Isometric 3D experiment with PIXI.js using ReactJS.
Click & drag around to move the map.

The map-related data is gathered from the OpenElevation API running locally as a Docker instance.
More infos on Github: https://github.com/Jorl17/open-elevation/blob/master/docs/host-your-own.md

What I wanted to do was: 
- you drag around the map
- select the area you want to render
- then the app renders the data on the isometric 3d map
Unfortunately, the API is too demanding for the server I am running everything on, and cannot be used on my current infrastructure.

Anyway, **here is a demo**: http://isometric.sinippe.com

And here is how the city of Lyon renders in isometric 3d:
![](https://raw.githubusercontent.com/sinippe/reactjs-pixijs-isometric3d-map/master/assets/lyon_isometric.png)

---

## Launch

`npm run start` or `yarn start`

---

## Run the whole app locally

Component **MapSelector** is not implemented in the demo. It should use a service which gathers data from the OpenElevation API.
You can use this small app on your local machine: https://github.com/sinippe/node-express-map-data.
But you will have to find a solution to host the API on your own.

---

## Credits

Many thanks to (Kaendor)[https://github.com/Kaendor] for his work on class (Color)[https://github.com/Kaendor/Color].
If you're looking for a way to make linear interpolations between colors, you should check it out.

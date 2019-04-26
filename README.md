# Isometric 3D Map

Isometric 3D experiment with PIXI.js using ReactJS.
Click & drag around to move the map.

The map-related data is gathered from the OpenElevation API running locally as a Docker instance.
More infos on Github: https://github.com/Jorl17/open-elevation/blob/master/docs/host-your-own.md

**Demo**: http://sinippe.com/isometric

---

## Launch

`npm run start` or `yarn start`

---

## Work In Progress

This project is a WIP.
The set of data used to render the demo is `lyon.json`. It is supposed to show a portion of the city of Lyon, France.

There will be all sorts of udpates in the near future:

- **a compass** (in any case, a more advanced UI) to know where things are (e.g. cardinal points)
- **a massive optimisation** to prevent computers from melting when processing the data
- **more data**!

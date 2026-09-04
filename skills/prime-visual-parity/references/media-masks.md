# Media Masks

Use a mask only for a Figma media node that the Prime workflow has already classified as `media-pending` under the approved raster policy.

Every mask records:

- a unique mask ID;
- the matching local media `nodeId`;
- the PNG `captureId` without its extension;
- its pixel box relative to that capture.

The matching audit node must use `kind: "media"`. The mask must stay inside the capture and must not cover the complete capture. Duplicate masks, missing media nodes, unknown captures, out-of-bounds boxes, and whole-section masks are blocking.

A mask excludes only replaceable media pixels. Continue to audit:

- the media node's x/y position, width, height, and aspect ratio;
- border width and corner radii;
- surrounding padding and gaps;
- captions, controls, badges, and semantic overlays;
- surface treatment outside the content region.

Do not mask approximate markup that should have been implemented as semantic DOM. Do not use a mask to hide an unavailable icon, wrong card grid, text mismatch, or spacing error.

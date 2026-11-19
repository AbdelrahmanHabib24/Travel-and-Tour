# Travel robot avatar

Asset: `public/sunny-avatar-transparent.png`

Source identity: `public/sunny-avatar.webp`.

Created with the built-in `image_gen` tool (`imagegen` skill), edit mode, with
`transparent_background: true`. The original asset is retained. The same new
PNG is used in the chat header, launcher, message avatars, typing indicator and
voice view. Canvas code adds a bounded soft halo and audio-driven motion; it
does not paint a rectangular background.

Final prompt:

> Use case: background-extraction. Asset type: transparent PNG cutout for an existing travel assistant website. Input image is the exact edit target and identity reference. Remove ONLY the cyan/blue geometric background and isolate the exact same visible friendly white 3D travel robot wearing a woven straw hat with navy band, cyan glowing happy eyes and smile, turquoise backpack straps and black camera. Preserve the original frontal pose, face shape, exact hat, body proportions, camera, materials, colors, lighting and polished 3D render style. Keep the same visible upper-body crop; do not invent legs or change expression. Retain all robot/hat/camera/strap pixels and clean anti-aliased edges. Fully transparent alpha outside the robot silhouette, including around hat and shoulders. No background, no white rectangle, no checkerboard pattern, no glow backdrop, no floor or cast shadow, no text. The asset should match the original small chat-header avatar unmistakably.

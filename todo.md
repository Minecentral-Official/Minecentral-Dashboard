GENERAL
<!-- - On the "Resources" nav bar button allow the options to display when users hovers over it instead of needing to click it -->

<!-- - Change the colors a bit so the main colors on buttons are Green (https://hslpicker.com/#42ff52) -->

<!-- - Hover color for links needs to be a bit more noticeable, maybe a bit darker -->

<!-- - Make the colors for badges be not pure black, like a light gray -->

<!-- - Card title fonts might need to be larger, take this page for example "http://localhost:3000/dashboard/resources/betterrtp1234" or "http://localhost:3000/dashboard/account" -->

<!-- - Header logo move it to the center on mobile and left on desktop -->

<!-- - Make the buttons Resources, Hosting and server list centered on the page on desktop -->

- On mobile, ditch the navbar and logo, make the navbar be a sticky bar at the bottom (so people using phones can tap easier).
  NOT LOGGED IN:
  - Make there be a Home button as an icon
  - Search Icon that displays a Drawer: with options for plugins, mods and so on, all the available resouces are in this config (C_ResourceType) to get the link to each type use getResourceUrl().
  - Sign in icon that allows users to sign in
  LOGGED IN:
  - Home button
  - Search Button drawer same as above
  - Dashboard button
  - Profile Avatar button: When clicked opens another drawer thing with the same options in the AuthNav component

<!-- HOSTING
- Make the `try it` button on the /hosting/pricing actually navigate to /dashboard/hosting/add. Maybe even select the correct package so people dont have to click twice?
- Make the /dashboard/hosting/add look WAY better -->

RESOUCES
<!-- - Make the arrows chevrons in the /plugins page rotate/animate 180 when toggling the Categories and Versions filters -->
- Add some tabs on the (resource-search)/layout.tsx file so people can quickly navigate to /plugins,/mods,/shaders
- Style this page better, this is copying modrinth almost exactly, want a fresh view from you
http://localhost:3000/plugins/betterrtp1234
You might be able to edit it using this link: http://localhost:3000/dashboard/resources/betterrtp1234

- plugins/[slug] Change the top of this page, so like the title, download button follow/settings button to be part of the /plugins/[slug]/layout.tsx file. Reason is because I will be adding pages like /versions, /moderation and /changelog but I still want the resources information displayed above

IF POSSIBLE
- The styles on the Markdown editor components/markdown-editor/markdown-editor.tsx from @uiw/react-markdown-editor. The styles change when using it in dev vs production (derpy in production)

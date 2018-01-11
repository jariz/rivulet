![](https://jari.lol/F0fKK2wPgs.svg)

WIP

## TODO
Radarr and sonarr will henceforth be called 'library managers'

### Basic functionality
- [x] Env configuration (library manager urls)
- [x] Database setup (`lokijs`)
- [x] Login/Register (`passport`)
- [ ] Timestamp updating (possibly through websocket?)
- [x] Episode file serving   
    - [ ] Made in a way that could be decoupled from rivulet-server, in case library manager is not present on current environment.
- Casting
    - [x] Device discovery ([SSDP](https://www.npmjs.com/package/node-ssdp)): both gcast+DLNA can be discovered with this method
    - [x] Chromecast implementation ([inspiration](https://github.com/xat/castnow))
    - [ ] DLNA implementation ([inspiration](https://github.com/xat/dlnacast))
    - [ ] Timestamp updating
- [ ] Casting nicetohaves
    - [ ] Next episode autoplay
    - [ ] Cast playback controllable from API (seek, pause, play, next)


### Devtools
- [ ] remove react rules from tslint config
- [ ] implement node-debug (express & node-ssdp are using it too)
- [ ] add husky, lint-staged, prettier, tslint precommit hook
- [ ] add tslint to webpack
- [ ] error handler (json instead of html with `pre` tag)

### Later on...
- DASH streaming.
   - [ ] Generate mpd file
   - [ ] Make transcoding endpoint accept different bitrates
   - [ ] Migrate player over to [DASH.js](http://reference.dashif.org/dash.js/nightly/samples/dash-if-reference-player/index.html)
- Library management
    The endgoal is of course for rivulet to be completely standalone.  
    For now this is outside of the scope because we want rivulet to focus on creating the best playback experience possible,     without bothering too much about the underlying library management.
    - [ ] Add directories
        - [ ] From file system
        - [ ] From external source? (SMB, DLNA)
    - [ ] Read metadata files
    - [ ] Detect file changes in source, trigger rescan
- decide if rivulet-server & rivulet-client should be merged for easier setup?

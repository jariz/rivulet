## Rivulet
Server!

## TODO
Radarr and sonarr will henceforth be called 'library managers'

### Basic functionality
- Env configuration (library manager urls)
- Database setup (`lowdb`)
- Login (`passport`)
- Timestamp updating (possibly through websocket?)
- Episode file serving   
    Possibly made in a way that could be decoupled from rivulet-server, in case library manager is not present on current environment.
- Casting
    - Device discovery ([SSDP](https://www.npmjs.com/package/node-ssdp)): both gcast+DLNA can be discovered with this method
    - Chromecast implementation ([inspiration](https://github.com/xat/castnow))
    - DLNA implementation ([inspiration](https://github.com/xat/dlnacast))
    - Timestamp updating
- Casting nicetohaves
    - Next episode autoplay
    - Cast playback controllable from API (seek, pause, play, next)


### Devtools
- add husky, lint-staged, prettier, tslint precommit hook
- add tslint to webpack

### Later on...
- decide if rivulet-server & rivulet-client should be merged for easier setup?
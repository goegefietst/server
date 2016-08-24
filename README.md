# Goe Gefietst Server

This is the server for the Goe Gefietst app. Repositories can be found at https://github.com/goegefietst.

### Configuration
Make sure you have [node.js] and [MongoDB] installed. Then install dependencies:

    $ npm install

Runs with the default configuration config-example.json, you can run with your own config as such:

    $ node express.js --config yourConfig.json

The MongoDB login defaults to admin:admin, replace the login by null if no account is required.
Interval configuration is amount of minutes before server recalculates cache.

### Version
0.0.1 in development

License
----
Copyright (C) 2016 TreinTramBus

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

[//]: #

   [npm]: <https://www.npmjs.com/>
   [node.js]: <https://nodejs.org/en/>
   [MongoDB]: <https://www.mongodb.org/>

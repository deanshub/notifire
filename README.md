Design document for Notifire
============================

# Directory structure
Notifire was built with node.js (server) and angular (client)

	notifire/						--> one folder to contain them all

		server/						--> main config files for running the server
			common/					--> common configuration files to collect features
			features/				--> features in seperate folders
				home/				--> takes care of the ejs rendering
				notifications/		--> api for communicating with waze server

		client/						--> main config files for running the client
			build/					--> compiled, compressed and compatible files of the src folder
			src/					--> all client source files
				images/				--> images directory
				scripts/			--> main config files of angular
					controllers/	--> so that the ui can interact with the model
					directives/		--> elements and other directives config files
					filters/		--> filters for text manipulation
					services/		--> the model files to (+interact with the server)
				styles/				--> all css files
				views/				--> the partial views

# List of libraries/plugins/open-source
## Global npms (Must have for notifire to run)
1. gulp
2. bower
3. nodemon

## Local npms
1. express
2. body-parser
3. request
4. ejs

### npm dev dependecies
1. gulp
2. gulp-autoprefixer
3. gulp-uglify
4. gulp-imagemin
5. gulp-plumber
6. gulp-cssshrink
7. gulp-nodemon
8. gulp-inject
9. main-bower-files
10. gulp-bower
11. gulp-htmlmin

## Local bower components
1. angular
2. leaflet
3. jquery
4. angular-route
5. bootstrap
6. angular-resource

# Link
[Notifire](http://waze.shubapp.com)

# How to run notifire
go to the server directory and run
`npm install`
`gulp start`
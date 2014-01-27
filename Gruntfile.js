module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            dist: {
                src: [
                    'js/lib/OpenLayers.js',
                    'js/lib/jquery-1.9.1.min.js',
                    'js/lib/underscore-min.js',
                    'js/lib/backbone-min.js',
                    'js/models/*.js',
                    'js/collections/*.js',
                    'js/views/*.js',
                    'js/routers/*.js',
                    'js/app.js',
                ],
                dest: 'js/build/app.js',
            }
        },
        uglify: {
            build: {
                src: 'js/build/app.js',
                dest: 'js/build/app.min.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/build/global.css': 'css/global.scss'
                }
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['js/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['css/*.scss'],
                tasks: [ /*'sass'*/ ],
                options: {
                    spawn: false,
                }
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['watch']);

};
var src = 'public/';
var dest = 'dist/';

var scripts = [
	'public/js/script.js'
];

var vendor = [
	'public/js/jquery-1.11.2.min.js',
	'public/js/bootstrap.min.js',
	'public/js/highlight.pack.js'
];

var styles = [
	'bootstrap.min.css',
	'font-awesome.css',
	'wicked-grit.css',
	'solarized_light.css',
	'style.css'
];

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['dist'],
			cleanup_js: ['dist/js/*.*', '!dist/js/frontier.*'],
			cleanup_css: ['dist/css/*.css', '!dist/css/frontier.*.css']
		},
		jade: {
			build: {
				options: {
					data: {
						debug: false,
						pretty: false,
						block: {
							hash: '<%= pkg.hash %>'
						}
					}
				},
				files: {
					'dist/index.html': 'views/index.jade'
				}
			}
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: 'public/fonts/',
						src: ['minimal-*.*'],
						dest: 'dist/fonts/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'public/images/',
						src: ['*.ico'],
						dest: 'dist/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'public/images/',
						src: ['*.*'],
						dest: 'dist/images/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'public/css/',
						src: styles,
						dest: 'dist/css/',
						filter: 'isFile'
					},
					{
						src: 'public/js/jquery-1.11.2.min.map',
						dest: 'dist/js/jquery-1.11.2.min.map'
					}
				]
			}
		},
		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: 'dist/css',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/'
				}]
			}
		},
		concat: {
			vendor: {
				src: vendor,
				dest: 'dist/js/vendor.min.js'
			},
			scripts : {
				options: {
					separator: ';',
				},
				src: scripts,
				dest: 'dist/js/app.js'
			},
			frontier: {
				options: {
					sourceMap: true
				},
				src: ['<%= concat.vendor.dest %>', '<%= uglify.app.dest %>'],
				dest: 'dist/js/frontier.min.js'
			},
			css: {
				src: ['dist/css/*.min.css', 'dist/css/*.css'],
				dest: 'dist/css/frontier.min.css'
			}
		},
		uglify: {
			app: {
				options: {
					mangle: false,
				},
				dest: 'dist/js/app.min.js',
				src: ['<%= concat.scripts.dest %>']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean', 'jade', 'copy', 'cssmin', 'concat:vendor', 'concat:scripts', 'uglify', 'concat:frontier', 'concat:css', 'clean:cleanup_js', 'clean:cleanup_css']);
	grunt.registerTask('build',   'default');
};
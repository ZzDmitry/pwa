module.exports = (grunt) => {
  grunt.initConfig({
    log: {
      q: 1,
      w: [22, 33],
      e: { r: 't' },
    },
    clean: {
      dist: 'dist',
    },
    copy: {
      dist: {
        src: 'src/**',
        dest: 'dist/',
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', 'Default task', []);
  grunt.registerTask('cp', 'CP', ['copy']);
  grunt.registerTask('cl', ['clean']);
  grunt.registerMultiTask('log', function() {
    const done = this.async();
    const l = grunt.log.write('Grunt logging...', this.target, this.data, JSON.stringify([...arguments]));
    if (this.target === 'q') {
      grunt.task.requires('log:w');
    }
    setTimeout(
      () => {
        l.ok();
        grunt.log.write(JSON.stringify(grunt.config('log.e.0')));
        done();
      },
      1000
    );
  });
  grunt.registerTask('log1', function() {
    const l = grunt.log.write('Grunt logging...', this.name, JSON.stringify([...arguments]));
  });
  grunt.registerTask('logs', function() {
    grunt.task.run(['log:w', 'log:q']);
  });
};

require("xunit-file");

module.exports = function (grunt) {
  grunt.initConfig({    
    simplemocha: {
      options: {
        globals: ["should", "chai"],
        timeout: 3000,
        ignoreLeaks: false,
        ui: "bdd",
        reporter: "tap"
      },
      all: { src: ['spec/common/*.js'] }
    }
  });  
  grunt.loadNpmTasks("grunt-simple-mocha");
  grunt.registerTask("default", ["simplemocha:all"]);
};

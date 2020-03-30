var gulp = require('gulp');
var sonarqubeScanner = require('sonarqube-scanner');

gulp.task('default', function (callback) {
   // 
    sonarqubeScanner({
        serverUrl: "http://oursonarhero.fivepoints.fr",
        token: "10aae15fc10e65ecb3bd59835de1f45ef99e6bfd",
        options:{
            "sonar.projectKey":"academy-platform-backend"
        }
    },callback);
});

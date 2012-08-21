all: css/styles.dev.css

css/tumblr.css: less/tumblr.less
	lessc less/tumblr.less > css/tumblr.css

css/styles.dev.css: less/styles.less
	lessc less/styles.less > css/styles.dev.css

deploy: css/styles.css javascripts/kicksontheroad.js

css/styles.css: css/styles.dev.css
	cp css/styles.dev.css css/styles.css

javascripts/kicksontheroad.js: javascripts/kicksontheroad.dev.js
	cp javascripts/kicksontheroad.dev.js javascripts/kicksontheroad.js

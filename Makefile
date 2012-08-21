all: css/styles.css

css/tumblr.css: less/tumblr.less
	lessc less/tumblr.less > css/tumblr.css

css/styles.css: less/styles.less
	lessc less/styles.less > css/styles.dev.css

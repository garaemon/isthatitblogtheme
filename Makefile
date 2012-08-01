all: css/tumblr.css

css/tumblr.css: less/tumblr.less
	lessc less/tumblr.less > css/tumblr.css

browserify -g [envify --NODE_ENV 'production'] -r ksana-codemirror -r codemirror -x react -x react-dom | uglifyjs --screw-ie8 -c=dead_code,evaluate,loops,unused -m > ../static/codemirror-bundle.min.js
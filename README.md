# monogrammaker

## Backend installation

###Environment Setup:

	You will need to install these programs on your server.

	* Inkscape
		https://inkscape.org/release/0.92.3/
	* pstoedit 
		http://www.pstoedit.net/
	* GhostScript
		https://www.ghostscript.com/download/gsdnld.html

	Make sure inkscape and pstoedit are accessible from the
	command line, meaning you can run "inkscape --usage" or "pstoedit -help" and
	get a list of command options.
	On most linux distributions you should be able to use apt
	or similar to install the packages, on MacOSX you may need to use something
	like ports to install pstoedit then manually add the PATH options in your 
	startup script (.bashrc or similar).

	And then copy the entire API directory inside htdocs folder.


###APIs:

	API name: svg-to-eps converter
	Usage:
		This API accepts svg file, converts it to eps file and returns URL of the generated eps file.
	API URL:
		{$server_domain}/svgToEps
	Http method: POST
	Params:
		file: svg file (multipart-formdata)
	Return:
		type: json
		example: {"url":"http://localhost/ci-svgmaster/uploads/apple9.eps"}



	API name: svg-to-dxf converter
	Usage:
		This API accepts svg file, converts it to dxf file and returns URL of the generated dxf file.
	API URL:
		{$server_domain}/svgToEps
	Http method: POST
	Params:
		file: svg file (multipart-formdata)
	Return:
		type: json
		example: {"url":"http://localhost/ci-svgmaster/uploads/apple9.dxf"}




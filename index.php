<html>
<head>
	<title>Visualization of an irrational number</title>
	<link rel="stylesheet" href="CSS/styles.css" />
	<link rel="stylesheet" href="highlighter/style.css" />
	<link rel="stylesheet" href="highlighter/themes/prism-twilight.css" data-noprefix />
	<script src="highlighter/prefixfree.min.js"></script>
	<script type="text/javascript" src="JS/filesaver.js"></script>
	<script type="text/javascript" src="JS/canvas-toBlob.js"></script>
</head>
<body style="background-color:black;">
´
<canvas id="seqCanvas" width="730" height="730">
</canvas>
<div class="button save" onclick="save()">Save as png</div>

<br><br>
<pre>
	<code class="language-javascript">
	<?php
	$js_file = file_get_contents('JS/index.js');
	echo $js_file;
	?>
	</code>
</pre>
	
<script type="text/JavaScript" src="JS/index.js"></script>
<script src="highlighter/prism.js" data-default-language="markup"></script>
</body>
</html>
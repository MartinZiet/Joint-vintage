<html>
<head>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
</head>

<body>
<textarea id="aaa" cols=70 rows=20>

x = '';
$.ajax({
	url: 'http://localhost/Joint/api/api.php/login', 
	type: 'POST',
	data: {username: 'pawel', password: 'pawel'}, 
	success : function (zwrot) {
		console.log(zwrot);
	},
	error : function (zwrot) {
		x = zwrot;
		console.log("error" + zwrot);
	}
	
	
	});


</textarea>
<button onclick="eval(document.getElementById('aaa').value)">GO</button>

</body>
</html>
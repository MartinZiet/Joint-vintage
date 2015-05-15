<html>
<head>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
</head>

<body>
<textarea id="aaa">
function login (u, p) {

$.ajax({
	url: 'http://213.165.69.41/api/api.php/login', 
	type: 'POST',
	data: {username: u, password: p}, 
	success : function (zwrot) {
		console.log(zwrot);
	},
	error : function (zwrot) {
		console.log("error" + zwrot);
	}
	
	
	});
}

</textarea>
<button onclick="eval(document.getElementById('aaa').value)">GO</button>

</body>
</html>
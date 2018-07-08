(function (global) {
	const regex = {
		false: /^(F|f)alse$/,
		null: /^(N|n)ull$/,
		json: /^[\[\{]/,
		true: /^(t|T)rue$/
	};

(function (global) {
	const regex = {
		false: /^(F|f)alse$/,
		null: /^(N|n)ull$/,
		json: /^["\[{].*[}\]"]$/,
		true: /^(T|t)rue$/
	};

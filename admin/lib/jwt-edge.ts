export async function signJWT(
	payload: any,
	secret: string,
	expiresIn = "8h"
): Promise<string> {
	const encoder = new TextEncoder();

	// Create header
	const header = {
		alg: "HS256",
		typ: "JWT",
	};

	// Create payload with expiration
	const now = Math.floor(Date.now() / 1000);
	const exp =
		now + (expiresIn === "8h" ? 8 * 60 * 60 : Number.parseInt(expiresIn));

	const jwtPayload = {
		...payload,
		iat: now,
		exp: exp,
	};

	// Encode header and payload
	const encodedHeader = btoa(JSON.stringify(header))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
	const encodedPayload = btoa(JSON.stringify(jwtPayload))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	// Create signature
	const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
	const secretKey = encoder.encode(secret);

	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		secretKey,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);

	const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
	const encodedSignature = btoa(
		String.fromCharCode(...new Uint8Array(signature))
	)
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

	return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function verifyJWT(token: string, secret: string): Promise<any> {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) {
			throw new Error("Invalid token format");
		}

		const [header, payload, signature] = parts;

		// Decode header and payload
		const decodedHeader = JSON.parse(
			atob(header.replace(/-/g, "+").replace(/_/g, "/"))
		);
		const decodedPayload = JSON.parse(
			atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
		);

		// Check expiration
		if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
			throw new Error("Token expired");
		}

		// Verify signature using Web Crypto API
		const encoder = new TextEncoder();
		const data = encoder.encode(`${header}.${payload}`);
		const secretKey = encoder.encode(secret);

		const cryptoKey = await crypto.subtle.importKey(
			"raw",
			secretKey,
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["verify"]
		);

		// Convert base64url signature to ArrayBuffer
		const signatureBuffer = Uint8Array.from(
			atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
			(c) => c.charCodeAt(0)
		);

		const isValid = await crypto.subtle.verify(
			"HMAC",
			cryptoKey,
			signatureBuffer,
			data
		);

		if (!isValid) {
			throw new Error("Invalid signature");
		}

		return decodedPayload;
	} catch (error) {
		throw new Error("Invalid token");
	}
}

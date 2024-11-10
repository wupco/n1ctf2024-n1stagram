/* 
 This file is based on a CTF challenge image from justCTF 2024 teaser (https://ctftime.org/task/28579).
 The original Author is @tomek7667
 Adapted for use in N1CTF 2024
*/
const fs = require("fs");
const pocketbase = require("pocketbase/cjs");
const dbUrl = "http://app";
const adminEmail = "admin@n1ctf.ctf";
const adminPassword = process.env.ADMIN_PASSWORD;
const flagPassword = process.env.FLAG_PASSWORD;
const FLAG = process.env.FLAG;
if (!/^[a-z0-9\{\}]+$/.test(FLAG)) {
	console.error("FLAG is invalid");
	process.exit(1);
}
const memePhrases = [
	"Bruh moment",
	"It is what it is",
	"That’s cap",
	"Based and redpilled",
	"I can’t even",
	"We live in a society",
	"Do it for the memes",
	"Sussy baka",
	"Big oof",
	"No cap, fr fr",
	"Sheesh!",
	"Ok, boomer",
	"Hold my beer",
	"Send it",
	"Certified hood classic",
	"Mood",
	"Vibe check",
	"Hits different",
	"Say less",
	"Slaps",
	"Yikes!",
	"Ratio + L + Didn’t ask",
	"Poggers",
	"Bet",
	"I’m baby",
	"Main character energy",
	"Touch grass",
	"Ayo?",
	"That ain’t it, chief",
	"Lowkey / Highkey"
  ];

const setupDB = async (email, password) => {
	const url_BmNF_1 = `${dbUrl}/api/admins`;
	const headers_WAMJ_1 = {
		Origin: dbUrl,
		Referer: `${dbUrl}/_/?installer`,
		Connection: "close",
		"Content-Type": "application/json",
	};
	const body_BBfI_1 = {
		email: email,
		password: password,
		passwordConfirm: password,
	};
	await fetch(url_BmNF_1, {
		method: "POST",
		headers: headers_WAMJ_1,
		body: JSON.stringify(body_BBfI_1),
	});
};

const createTable = async (token) => {
	const url_Aobe_1 = `${dbUrl}/api/collections`;
	const headers_WLYv_1 = {
		Origin: dbUrl,
		Authorization: token,
		"Content-Type": "application/json",
	};

	const body_ZkPq_1 = {
		id: "",
		created: "",
		updated: "",
		name: "secret_posts",
		type: "base",
		system: false,
		listRule: "@request.auth.id = creator.id",
		viewRule: "@request.auth.id = creator.id",
		createRule: "@request.auth.id = creator.id",
		updateRule: "@request.auth.id = creator.id",
		deleteRule: "@request.auth.id = creator.id",
		schema: [
			{
				id: "",
				name: "title",
				type: "text",
				system: false,
				required: false,
				options: { min: 3, max: 204, pattern: "" },
				onMountSelect: false,
				originalName: "field",
				toDelete: false,
			},
			{
				id: "",
				name: "creator",
				type: "relation",
				system: false,
				required: true,
				options: {
					maxSelect: 1,
					collectionId: "_pb_users_auth_",
					cascadeDelete: true,
				},
				onMountSelect: false,
				originalName: "field",
				toDelete: false,
				nullable: false,
			},
            {
                id: "",
                name: "content",
                type: "text",
                system: false,
                required: true,
                options: { min: 3, max: 204, pattern: "" },
                onMountSelect: false,
                originalName: "field",
                toDelete: false
            }
		],
		indexes: [],
		options: {},
		originalName: "",
	};
	const response = await fetch(url_Aobe_1, {
		method: "POST",
		headers: headers_WLYv_1,
		body: JSON.stringify(body_ZkPq_1),
	});
	await response.json();
};

const authenticate = async (pb) => {
	await pb.admins.authWithPassword(adminEmail, adminPassword);
};

const seed = async (pb) => {
	const token = pb.authStore.baseToken;
	await createTable(token);
	const user = await pb.collection("users").create({
		username: "flag",
		password: flagPassword,
		passwordConfirm: flagPassword,
	});

	for (let i = 0; i < 30; i++) {
		var formData = new FormData();
		formData.append("title", "flag");
		formData.append("creator", user.id);
		formData.append("content", FLAG + "," + memePhrases[i]);
		await pb.collection("secret_posts").create(formData);
	}
	
};

const main = async () => {
	while (true) {
		try {
			await fetch(dbUrl);
			break;
		} catch (e) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
	console.log("setting up db", adminEmail, adminPassword);
	await new Promise((resolve) => setTimeout(resolve, 5000));
	await setupDB(adminEmail, adminPassword);
	const pb = new pocketbase(dbUrl);
	await authenticate(pb);
	await seed(pb);
	console.log("db setup complete");
};

(() => main())();
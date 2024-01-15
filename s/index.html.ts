import {
	html,
	template,
	easypage,
	startup_scripts_with_dev_mode,
} from "@benev/turtle"

export default template(async (basics) => {
	const path = basics.path(import.meta.url)
	return easypage({
		path: basics.path(import.meta.url),
		title: "callee-slate",
		head: html`
			<link rel="stylesheet" href="${path.version.root("index.css")}" />
			${startup_scripts_with_dev_mode(path)}
		`,
		body: html` <div>hello</div> `,
	})
})

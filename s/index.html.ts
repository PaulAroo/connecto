import {
	html,
	template,
	easypage,
	startup_scripts_with_dev_mode,
} from "@benev/turtle"

export default template(async (basics) => {
	const path = basics.path(import.meta.url)
	const cssPath = path.version.root("index.css")
	return easypage({
		path,
		title: "callee-slate",
		head: html`
			<link rel="stylesheet" href="${cssPath}" />
			${startup_scripts_with_dev_mode(path)}
		`,
		body: html`
			<div>hello</div>
			<connect-to></connect-to>
		`,
	})
})

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
		title: "connecto",
		head: html`
			<link rel="stylesheet" href="${cssPath}" />
			<meta name="darkreader-lock">
			${startup_scripts_with_dev_mode(path)}
		`,
		body: html`
			<div class=wrapper>
				<h1>Connecto</h1>
				<p>
					Start a call session and share the link with whoever you want to speak
					with
				</p>
				<connect-to></connect-to>
			</div>
		`,
	})
})

import { TemplateResult } from "@benev/slate"

export const when = <T>(
	data: T | undefined,
	renderer: (data: T) => TemplateResult
) => {
	if (!!data) {
		return renderer(data)
	} else {
		return undefined
	}
}

import { Router } from "express";
import { htmlTemplate } from "./HtmlTemplate";

/** Adds an express handler for hte loginGui path. */
export const setupAdminGui = (router: Router) =>
	router.get("/loginGui", [async (req: Request, res) => {
		res.send(htmlTemplate({body: "", title: "Login", bundleName: "login"}))
	}])

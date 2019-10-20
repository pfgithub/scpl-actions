export{}
// import React, { useState, useEffect, useReducer } from "react";
// import "./App.css";
// import {
// 	BrowserRouter as Router,
// 	Route,
// 	Switch,
// 	RouteComponentProps,
// 	Link,
// 	withRouter
// } from "react-router-dom";
// import { allActions, getActionFromName } from "shortcuts3types";
// import { WFAction } from "shortcuts3types/built/src/ActionData";
// import { TextParameter } from "./parameters/TextParameter";
// import { WFTextInputParameter } from "shortcuts3types/built/src/Parameters/WFTextInputParameter";
// import CSSDemo from "./demo/CSSDemo";
// 
// let actionList = allActions.sort((a, b) =>
// 	a.name > b.name ? 1 : a.name < b.name ? -1 : 0
// );
// 
// const ScrollToTop = withRouter(({ children, location: { pathname } }: any) => {
// 	useEffect(() => {
// 		window.scrollTo(0, 0);
// 	}, [pathname]);
// 
// 	return children || null;
// });
// 
// export type Props = {};
// export default function App(props: Props) {
// 	return (
// 		<Router>
// 			<div className="page">
// 				<nav className="links">Page</nav>
// 				<NavSidebar />
// 				<div className="docs">
// 					<Switch>
// 						<Route path="/" exact component={Homepage} />
// 						<Route path="/search?q=:searchquery" component={SearchPage} />
// 						<Route path="/actions/:action" component={ActionPage} />
// 						<Route path="/cssdemo" component={CSSDemo} />
// 						<Route component={Error404Page} />
// 					</Switch>
// 				</div>
// 			</div>
// 		</Router>
// 	);
// }
// 
// function NavSidebar() {
// 	let [searchTerm, setSearchTerm] = useState("");
// 	return (
// 		<aside className="sidebar">
// 			<input
// 				type="text"
// 				value={searchTerm}
// 				placeholder="Search..."
// 				onChange={e => setSearchTerm(e.currentTarget.value)}
// 			/>
// 			<NavSidebarItem
// 				searchTerm={searchTerm}
// 				items={actionList.map(action => ({
// 					name: action.name,
// 					searchArea: `${action.name}, ${(
// 						action._data.ActionKeywords || []
// 					).join(", ")}`,
// 					key: action.id,
// 					url: `/actions/${encodeURIComponent(action.shortName)}`
// 				}))}
// 			/>
// 		</aside>
// 	);
// }
// 
// function NavSidebarItem(props: {
// 	searchTerm: string;
// 	items: { name: string; searchArea: string; key: string; url: string }[];
// }) {
// 	let [show, setShow] = useState(true);
// 	return (
// 		<>
// 			<h3
// 				className={"sideitemname " + (show ? "show" : "hide")}
// 				onClick={() => setShow(!show)}
// 			>
// 				Actions{show ? "" : ` (${props.items.length})`}
// 			</h3>
// 			<ul className={"sidebarlist " + (show ? "show" : "hide")}>
// 				{props.items.map(({ name, searchArea, key, url }) => {
// 					if (
// 						searchArea.toLowerCase().indexOf(props.searchTerm.toLowerCase()) ===
// 						-1
// 					) {
// 						return null;
// 					}
// 					return (
// 						<li>
// 							<Link key={key} to={url}>
// 								{name}
// 							</Link>
// 						</li>
// 					);
// 				})}
// 			</ul>
// 		</>
// 	);
// }
// 
// function Homepage(props: RouteComponentProps<{}>) {
// 	return <>"homepage"</>;
// }
// 
// type CodeState = {
// 	action: string;
// 	args: { name: string; value: string }[];
// };
// 
// type CodeAction = { type: "updateArg"; index: number; value: string };
// 
// function codeReducer(state: CodeState, action: CodeAction): CodeState {
// 	if (action.type === "updateArg") {
// 		return {
// 			...state,
// 			args: state.args.map((arg, i) =>
// 				i === action.index ? { ...arg, value: action.value } : arg
// 			)
// 		};
// 	}
// 	return state;
// }
// 
// function ActionPage(props: RouteComponentProps<{}>) {
// 	let actionName = (props.match.params as { action: string }).action;
// 	let actionData = getActionFromName(actionName) as WFAction;
// 	let [code, dispatchCode] = useReducer(codeReducer, {
// 		action: actionData.readableName,
// 		args: actionData._parameters.map(param =>
// 			typeof param === "string"
// 				? { name: "...", value: "..." }
// 				: {
// 						name: param.readableName,
// 						value: "..."
// 				  }
// 		)
// 	});
// 	if (!actionData) {
// 		return <div>404 action {actionName} not found</div>;
// 	}
// 	return (
// 		<>
// 			<ScrollToTop />
// 			<h5 className="actionname">{actionData.name}</h5>
// 			{actionData._parameters.map((parameter, i) => {
// 				// key i is acceptable because _parameters never changes
// 				if (typeof parameter === "string") {
// 					return (
// 						<div key={i} className="parameter notexists">
// 							{parameter}
// 						</div>
// 					);
// 				}
// 				if (parameter instanceof WFTextInputParameter) {
// 					return (
// 						<TextParameter
// 							key={i}
// 							parameter={parameter}
// 							updateArgumentValue={(value: string) =>
// 								dispatchCode({ type: "updateArg", index: i, value })
// 							}
// 						/>
// 					);
// 				}
// 				return (
// 					<div key={i} className="parameter">
// 						<h6 className="parametername">{parameter.name}</h6>
// 						<div className="parameterdetails">{parameter.typeName}</div>
// 					</div>
// 				);
// 			})}
// 			<pre>
// 				<code>
// 					<span className="hl_action">{code.action}</span>
// 					{code.args.map(arg => {
// 						return (
// 							<>
// 								{" "}
// 								<span className="hl_argname">{arg.name}</span>
// 								<span className="hl_argequals">=</span>
// 								<span className="hl_argvalue">{arg.value}</span>
// 							</>
// 						);
// 					})}
// 				</code>
// 			</pre>
// 		</>
// 	);
// 	// return (
// 	// 	<div>
// 	// 		<ReactMarkdown>{(actionData as any).genDocs()}</ReactMarkdown>
// 	// 	</div>
// 	// );
// }
// 
// function SearchPage() {
// 	return <>"search page"</>;
// }
// 
// function Error404Page() {
// 	return <>"error 404 page not found"</>;
// }

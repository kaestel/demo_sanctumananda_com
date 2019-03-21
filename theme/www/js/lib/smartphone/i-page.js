Util.Objects["page"] = new function() {
	this.init = function(page) {

		// header reference
		page.hN = u.qs("#header");
		page.hN.service = u.qs("ul.servicenavigation", page.hN);

		// content reference
		page.cN = u.qs("#content", page);

		// navigation reference
		page.nN = u.qs("#navigation", page);

		// footer reference
		page.fN = u.qs("#footer");
		page.fN.service = u.qs("ul.servicenavigation", page.fN);

		page.orientationchanged = function() {
			// forward orientation event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.orientationchanged) == "function") {
				this.cN.scene.orientationchanged();
			}
		}

		// global resize handler 
		page.resized = function() {
			// u.bug("page.resized:", this);

			// forward scroll event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.resized) == "function") {
				this.cN.scene.resized();
			}

			// Set height on navigation
			u.ass(this.nN, {
				"height":(window.innerHeight - this.hN.offsetHeight) + "px"
			});

			// update drag coordinates
			if (this.nN.is_open) {
				u.e.setDragPosition(page.nN.table, 0, 0);
				u.e.setDragBoundaries(page.nN.table, page.nN);
			}

		}

		// global scroll handler 
		page.scrolled = function() {
			// u.bug("page.scrolled:", this);

			// Fix issue with fixed element after scroll
			u.t.resetTimer(this.t_fix);
			this.t_fix = u.t.setTimer(this, "fixiOSScroll", 200);

			// forward scroll event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.scrolled) == "function") {
				this.cN.scene.scrolled();
			}

			// Highlight current section in navigation
			for(var i = 0; i < this.navigation_links.length; i++) {

				var nav_link = this.navigation_links[i];

				// Check if section is in view
				if (this.visible(nav_link.destination)) {
					u.ac(nav_link, "current");
				}
				else {
					u.rc(nav_link, "current");
				}
			}

		}

		// Page is ready
		page.ready = function() {
			// u.bug("page.ready:", this);

			// page is ready to be shown - only initalize if not already shown
			if(!this.is_ready) {

				// Function that detects wether or not element is in view;
				this.visible = function(e) {
					// Get elements coordinates from window view
					var bounding = e.getBoundingClientRect();

					// Assigning element top and bottom for comparison
					var top = bounding.top;
					var bottom = bounding.bottom;

					// Get height of navigation bar for compensation
					var navHeight = page.hN.offsetHeight;

					// Get supported version of window height depending on browser
					var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

					// If either top or bottom is bigger than 0 offset by navigations height and top is under window height,
					// then return true. Else return false.
					return (
						(top > 0 + navHeight || bottom > 0 + navHeight)
						&&
						top < windowHeight
					);
				}

				// page is ready
				this.is_ready = true;

				// set resize handler
				u.e.addWindowEvent(this, "resize", this.resized);
				// set scroll handler
				u.e.addWindowEvent(this, "scroll", this.scrolled);
				// set orientation handler
				u.e.addWindowEvent(this, "orientationchange", this.orientationchanged);


				this.initHeader();
				this.initNavigation();
				this.initFooter();
			}

		}

		// initialize header
		page.initHeader = function() {

			// Insert start link to nav
			this.li_start = u.ie(u.qs("ul.navigation", this.nN), "li");
			this.start_link = u.ie(this.li_start, "a", {"html":"start", "href":"#landing", "class":"current"});

			// Set height on navigation
			u.ass(this.nN, {
				"height":(window.innerHeight - this.hN.offsetHeight) + "px"
			});

			// Get top for scroll
			this.top = u.qs("#landing");

			// Scrollto on menu
			u.ce(this.hN.service);
			this.hN.service.clicked = function() {

				// Check if smooth scroll behavior is supported
				if ('scrollBehavior' in document.documentElement.style) {
					window.scrollTo({top:page.top.offsetTop - 75, behavior: 'smooth'});
				}
				// Old version of scrollTo supported in most browsers
				else {
					window.scrollTo(0, page.top - 75);
				}

				// Close nav if it's open
				if(page.nN.is_open) {
					page.burger.clicked();
				}

			}
			
			// Get buger button
			this.burger = u.qs("#header .servicenavigation li.navigation");
			this.burger.page = this;

			// Handling burger button
			u.ce(this.burger);
			this.burger.clicked = function(event) {

				// If button is in "burger" state
				if(!page.nN.is_open) {

					// Update state
					page.nN.is_open = true;

					// Change icon to close
					u.ac(this, "close");

					// Hide body scrollbar
					u.ass(page.body, {
						"overflow-y":"hidden"
					});

					// Show navigation scrollbar
					u.ass(page.nN, {
						"overflow-y":"scroll"
					});
					
					// Set height on navigation
					u.ass(page.nN, {
						"height":(window.innerHeight - page.hN.offsetHeight) + "px"
					});

					// Animation:
					// delete transitioned callback in order to avoid display:none
					delete page.nN.transitioned;

					// Set inital state before animating
					u.ass(page.nN, {
						"opacity":0, 
						"display":"block"
					});

					// Update drag coordinates
					u.e.setDragPosition(page.nN.table, 0, 0);
					u.e.setDragBoundaries(page.nN.table, page.nN);

					// Animate
					u.a.transition(page.nN, "opacity .5s ease");
					u.ass(page.nN, {
						"opacity":1
					});

				}

				// If button is in "close" state
				else {

					// Update state
					page.nN.is_open = false;

					// Change icon to burger
					u.rc(this, "close");

					// Show body scrollbar
					u.ass(page.body, {
						"overflow-y":"scroll"
					});

					// Hide navigation scrollbar
					u.ass(page.nN, {
						"overflow-y":"hidden"
					});

					// Animation:
					// Define what happens after transition on navigation is done
					page.nN.transitioned = function() {
						u.ass(this, {
							"display":"none"
						});
					}

					// Animate
					u.a.transition(page.nN, "opacity .5s ease");
					u.ass(page.nN, {
						"opacity":0
					});

				}
			}

		}

		// initialize navigation
		page.initNavigation = function() {
			
			// Add references to navigation
			this.nN.logo = u.qs("#navigation .logo", this.nN);
			this.nN.table = u.wc(this.nN, "div", {"class":"table"});
			this.nN.cell = u.wc(this.nN.table, "div", {"class":"cell"});
			this.nN.access = u.qs("#navigation .access", this.nN);

			// Get nav list
			this.navigation_links = u.qsa("#navigation a", this.nN);

			// Add click events and scrollTo positions to each li
			for(var i = 0; i < this.navigation_links.length; i++) {

				// Save nav link in memory
				var nav_link = this.navigation_links[i];

				// Get only #{target}
				nav_link.anchor = nav_link.href.replace(/[^#]+/,"");

				// Get target element
				if (nav_link.anchor === "#landing" || nav_link.anchor === "#bottom") {
					nav_link.destination = u.qs(nav_link.anchor);
				}
				else {
					nav_link.destination = u.qs(nav_link.anchor + " .container");
				}
				
				// Make each list elements clickable
				u.ce(nav_link);
				nav_link.clicked = function() {

					// Get targets position
					var destination_pos = u.absY(this.destination);

					// Determine offset
					if(this.anchor === "#bottom") {
						// Ignore anchor and make target bottom of page
						destination_pos = page.offsetHeight;
						offset = 0;
					}
					else if(this.anchor === "#money") {
						offset = 25;
					}
					else {
						offset = 75;
					}
					
					// Check if smooth scroll behavior is supported
					if ('scrollBehavior' in document.documentElement.style) {
						window.scrollTo({top:destination_pos - offset, behavior: 'smooth'});
					}
					// Old version of scrollTo supported in most browsers
					else {
						window.scrollTo(0, destination_pos - offset);
					}

					// Animation and state change:
					page.burger.clicked();
				}
			}

			// Display block so we can calculate drag boundaries, visually still hidden due to css opacity:0
			u.ass(this.nN, {"display":"block"});

			// Make navigation draggable, in case of small screen or landscape mode
			u.e.drag(this.nN.table, this.nN, {"strict":false, "elastica":200, "vertical_lock":true, "overflow":"scroll"});

			// Hide again
			u.ass(this.nN, {"display":"none"});

			// Prevent android chrome adressbar movement
			this.nN.table.moved = function(event) {
				u.e.kill(event); // Same as event.stopPropagation();
			}
		}

		page.initFooter = function() {
			// Get disclaimer
			this.disclaimer = u.qs("#disclaimer", this);

			// Disclaimer code
			if (this.disclaimer) {

				// Query body so we can hide body scroll
				this.body = u.qs("body");
				
				// Query open and close elements
				this.disclaimer_link = u.qs("#footer .copyright a", this.fN);
				this.disclaimer_close = u.qs("#disclaimer .close", this.disclaimer);

				// Make link clickable
				u.ce(this.disclaimer_link);
				this.disclaimer_link.page = this;
			
				// Open disclaimer
				this.disclaimer_link.clicked = function() {
					// Hide body scrollbar
					u.ass(page.body, {
						"overflow-y":"hidden"
					});

					// Show disclaimer scrollbar
					u.ass(page.disclaimer, {
						"overflow-y":"scroll"
					});

					// Show disclaimer
					u.ac(page.disclaimer, "visible");
				}
	
				// Make button clickable
				u.ce(this.disclaimer_close);
				this.disclaimer_close.page = this;
				
				// Close disclaimer
				this.disclaimer_close.clicked = function() {
					// Show body scrollbar
					u.ass(page.body, {
						"overflow-y":"scroll"
					});

					// Hide disclaimer scrollbar
					u.ass(page.disclaimer, {
						"overflow-y":"hidden"
					});

					// Hide disclaimer
					u.rc(page.disclaimer, "visible");
				}
			}
		}

		// iOS scroll fix
		page.fixiOSScroll = function() {

			u.ass(this.hN, {
				"position":"absolute",
			});


			u.ass(this.hN, {
				"position":"fixed",
			});

		}

		// ready to start page builing process
		page.ready();
	}
}

u.e.addDOMReadyEvent(u.init);

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


		// global resize handler 
		page.resized = function() {
			// u.bug("page.resized:", this);

			// forward scroll event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.resized) == "function") {
				this.cN.scene.resized();
			}
		}

		// global scroll handler 
		page.scrolled = function() {
			// u.bug("page.scrolled:", this);

			// forward scroll event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.scrolled) == "function") {
				this.cN.scene.scrolled();
			}

			// Backwards compatiable scroll check
			this.scrollY = u.scrollY();

			// If scroll offest is bigger than 80, and navigation isn't sticky
			if(this.scrollY > 80 ) {

				if (!this.nN.is_sticky) {
					// Update sticky flag
					this.nN.is_sticky = true;

					// Change to sticky state
					u.ac(page.nN, "sticky");
				}
				
			}
			// If scroll is less than 80, and navigation IS sticky
			else {

				if (this.nN.is_sticky) {
					// Update sticky flag
					this.nN.is_sticky = false;
			
					// Remove sticky state
					u.rc(page.nN, "sticky");
				}

			}


			// Highlight current destination in navigation
			for(var i = 0; i < this.navigation_links.length; i++) {

				// save in memory
				var nav_link = this.navigation_links[i];

				// Exception if destination is bottom/contact
				if (nav_link.anchor === "#bottom") {

					// If window scroll is ahead of bottom
					if (this.scrollY >= nav_link.destination.offsetTop) {
						u.ac(nav_link, "current");
					}
					else {
						u.rc(nav_link, "current");
					}

				}
				// Check if destination is in view
				else if (this.visible(nav_link.destination)) {
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
					var navHeight = page.nN.offsetHeight;

					// Get supported version of window height depending on browser
					var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

					// If either top or bottom is bigger than 0 offset by navigations height and top is under window height,
					// then return true. Else return false.
					return (
						(top  > 0 + navHeight || bottom > 0 + navHeight)
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

				// Ensure contact highlight
				this.bottom = u.qs("#bottom");

				this.initHeader();
				this.initNavigation();
				this.initFooter();
			}

		}

		// initialize header
		page.initHeader = function() {

		}

		// initialize navigation
		page.initNavigation = function() {

			// Add references on navigation so we can create sticky navigation
			this.nN.logo = u.qs("#navigation .logo", this.nN);
			this.nN.list = u.qs("#navigation ul.navigation", this.nN);
			this.nN.access = u.qs("#navigation .access", this.nN);

			// Position logo
			this.nN.access.parentNode.insertBefore(this.nN.logo, this.nN.access);

			// Get nav list
			this.navigation_links = u.qsa("#navigation a", this.nN);

			// Add click events and scrollTo positions to each anchor tag
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

					// Determine offset
					if(this.anchor === "#bottom") {
						// Scroll to bottom of div#bottom
						offset = -this.destination.offsetHeight;
					}
					else if(this.anchor === "#money") {
						offset = 25;
					}
					else {
						offset = 100;
					}
					
					// Scroll to element
					u.scrollTo(window, {"node":this.destination, "offset_y":offset});
				}
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


		// ready to start page builing process
		page.ready();
	}
}

u.e.addDOMReadyEvent(u.init);

import { CsvRow } from "./feedback.types";
import { FeedbackChannel } from "@prisma/client";

export const demoFeedback: (CsvRow & { channel: FeedbackChannel })[] = [
    // Performance & Speed
    {
        content: "The main dashboard takes more than 5 seconds to load when switching between views. This is slowing down our daily standups.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Enterprise Account A"
    },
    {
        content: "API response times for the feedback list endpoint are very high. Can we look into optimizing database queries?",
        channel: "COMMUNITY",
        customerLabel: "Developer User"
    },
    {
        content: "CSV exports are hitting timeout errors when downloading datasets larger than 10,000 rows. We need this for weekly reporting.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Analytics Lead"
    },
    {
        content: "Overall page transitions feel a bit sluggish on low-end laptops. Let's optimize client-side bundle size.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Database sync is occasionally locking up the UI during imports. Can we run imports asynchronously in the background?",
        channel: "MANUAL",
        customerLabel: "Product Manager"
    },
    {
        content: "Querying historical data is extremely slow. We need better indexes on the createdAt and status fields.",
        channel: "SUPPORT_TICKET",
        customerLabel: "System Admin"
    },
    {
        content: "The chart rendering on the analytics tab lags when there are too many data points. Let's add debouncing or aggregate data.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "Extremely fast and snappy app! The recent performance updates really made a huge difference.",
        channel: "TWITTER",
        customerLabel: "SaaS Influencer"
    },
    {
        content: "Search queries take too long to resolve when using multiple filter tags concurrently.",
        channel: "PLAY_STORE",
        customerLabel: "Android User"
    },
    {
        content: "Exporting large PDF reports is slow and sometimes fails completely without showing any error message.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Enterprise Account B"
    },

    // Dark Mode
    {
        content: "Please add dark mode. The bright white layout is hurting my eyes during late-night reviews.",
        channel: "COMMUNITY",
        customerLabel: "Power User"
    },
    {
        content: "The dark mode implementation is inconsistent. Some borders and input placeholders remain bright white.",
        channel: "APP_STORE",
        customerLabel: "iOS Reviewer"
    },
    {
        content: "I absolutely love the dark theme! It looks super sleek and premium. Great work on the design.",
        channel: "TWITTER",
        customerLabel: "Design Enthusiast"
    },
    {
        content: "Login and register screens are missing dark mode support. They are blindingly bright compared to the main dashboard.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "High-contrast accessibility theme requested for users with low vision. The current light mode gray-on-white text is hard to read.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Compliance Officer"
    },
    {
        content: "Some charts in dark mode have poor color contrast. The dark blue text on a black background is unreadable.",
        channel: "COMMUNITY",
        customerLabel: "Analyst"
    },
    {
        content: "Auto-detect system theme setting for light/dark mode is not working on mobile Safari.",
        channel: "PLAY_STORE",
        customerLabel: "Safari Mobile User"
    },
    {
        content: "The theme toggle button should be easier to find. Maybe place it in the main sidebar instead of nested in settings.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Custom color theme options would be amazing. Let us set primary brand colors for our workspace.",
        channel: "SALES_CALL",
        customerLabel: "Prospective Client"
    },
    {
        content: "Toggle dark mode instantly causes a brief white flash during layout repaint. Please fix the CSS variables loading order.",
        channel: "COMMUNITY",
        customerLabel: ""
    },

    // Mobile UX
    {
        content: "The sidebar navigation is completely broken on iPhone 13. I cannot open the menu at all in portrait mode.",
        channel: "APP_STORE",
        customerLabel: "iOS User"
    },
    {
        content: "Tables do not scroll horizontally on mobile screens. The content is clipped and cut off.",
        channel: "PLAY_STORE",
        customerLabel: "Mobile Tester"
    },
    {
        content: "Touch targets for edit and delete buttons are too small on mobile. I keep clicking the wrong row.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Having trouble using the CSV import interface on my iPad. Drag and drop doesn't work well on tablet browsers.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Operations Manager"
    },
    {
        content: "The mobile app is really intuitive. Love being able to check customer requests on the go.",
        channel: "APP_STORE",
        customerLabel: "iOS Reviewer"
    },
    {
        content: "Filter dropdown menus open off-screen on smaller mobile viewports. Needs auto-repositioning logic.",
        channel: "PLAY_STORE",
        customerLabel: ""
    },
    {
        content: "The loading animation on mobile takes up the whole screen and blocks back navigation.",
        channel: "COMMUNITY",
        customerLabel: "Mobile Developer"
    },
    {
        content: "Please optimize the layout for smaller phone screens. The workspace list overlaps with the header text.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Push notifications on iOS are delayed by several minutes. Makes real-time collaboration difficult.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Support Agent"
    },
    {
        content: "Great responsiveness on the main dashboard, but the settings panel is still difficult to navigate on mobile.",
        channel: "APP_STORE",
        customerLabel: ""
    },

    // Search & Filters
    {
        content: "Partial search queries are not returning any results. If I search 'dash', it should find 'dashboard'.",
        channel: "COMMUNITY",
        customerLabel: "Product Lead"
    },
    {
        content: "We need the ability to save search filter combinations. Selecting the same status and channel filters every morning is tedious.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Support Lead"
    },
    {
        content: "The search bar should highlight matching text inside the feedback content column.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Clear filters action is missing a shortcut key. Let us press Escape to clear search and filters.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "Filter count indicator would be helpful. Show how many items are in 'Under Review' next to the option.",
        channel: "SURVEY",
        customerLabel: "Analyst User"
    },
    {
        content: "Searching by customer label is case-sensitive, which makes it hard to find entries. It should be case-insensitive.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Customer Success"
    },
    {
        content: "Cannot search for feedback entries that have empty customer labels. Please add a 'No Label' filter option.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "The channel filter dropdown is missing an option for CSV imports. It's listed in the schema but not in the UI.",
        channel: "MANUAL",
        customerLabel: "Quality Tester"
    },
    {
        content: "Search is incredibly fast now! Finding specific tickets takes less than a second.",
        channel: "TWITTER",
        customerLabel: "Happy Customer"
    },
    {
        content: "Search results are reset whenever I edit a feedback entry. I lose my place in the list.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Lead Analyst"
    },

    // Notifications
    {
        content: "I am getting way too many email notifications. Please let us customize notification frequency or opt-out completely.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Notifications Manager"
    },
    {
        content: "Slack integration is highly requested. We want feedback alerts streamed directly into our product channels.",
        channel: "SALES_CALL",
        customerLabel: "Enterprise Prospect"
    },
    {
        content: "Mentioning teammates using @name does not send them any alert. Is this feature implemented yet?",
        channel: "COMMUNITY",
        customerLabel: "Collaboration User"
    },
    {
        content: "In-app notifications don't mark themselves as read automatically when I click on them. I have to click 'Mark all as read'.",
        channel: "PLAY_STORE",
        customerLabel: ""
    },
    {
        content: "Weekly digest emails are empty if no new feedback was submitted. It shouldn't send an empty email.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Desktop notifications ask for permission every single time the tab is reloaded on Chrome.",
        channel: "COMMUNITY",
        customerLabel: "Chrome User"
    },
    {
        content: "The notification bell icon should show a badge with the exact number of unread alerts instead of just a dot.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "We need webhook support for feedback events so we can trigger custom internal Slack notifications.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Tech Lead"
    },
    {
        content: "Notifications for status changes (e.g. Under Review -> Resolved) are not being sent to the original creator.",
        channel: "COMMUNITY",
        customerLabel: "Beta Tester"
    },
    {
        content: "Can we disable email alerts for views we aren't assigned to? Our inbox is overflowing.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Enterprise Partner"
    },

    // Ingestions & Exports
    {
        content: "The CSV import tool returns validation errors but doesn't tell us which column failed. The error message is too generic.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Data Ops"
    },
    {
        content: "CSV template has headers that mismatch what the API validation expects. Took me an hour to figure out the casing.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "Need Zendesk integration. Manually copying customer tickets into LOOP is a waste of time.",
        channel: "SALES_CALL",
        customerLabel: "VP of Support"
    },
    {
        content: "Intercom integration request. We want to sync conversations marked with tag 'feedback' directly to LOOP.",
        channel: "COMMUNITY",
        customerLabel: "Product Manager"
    },
    {
        content: "Importing CSV with UTF-8 characters breaks the content parsing. Emojis and accented letters become corrupt.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Global Ops"
    },
    {
        content: "Can we export feedback in JSON format instead of just CSV? We want to plug it into our custom analytics pipeline.",
        channel: "COMMUNITY",
        customerLabel: "Data Scientist"
    },
    {
        content: "CSV import doesn't let us map columns dynamically. We have to rename our spreadsheet fields to match your format exactly.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Demo data import is great for testing features quickly! Very helpful onboarding tool.",
        channel: "TWITTER",
        customerLabel: "Dev Evaluator"
    },
    {
        content: "We need an export API endpoint so we can fetch all resolved feedbacks automatically every night.",
        channel: "SUPPORT_TICKET",
        customerLabel: "DevOps Engineer"
    },
    {
        content: "The CSV import summary should display how many duplicates were ignored during ingestion.",
        channel: "COMMUNITY",
        customerLabel: ""
    },

    // AI & Analytics
    {
        content: "AI sentiment classification is tag-based? We need a numerical sentiment score to track trends over time.",
        channel: "COMMUNITY",
        customerLabel: "AI Engineer"
    },
    {
        content: "Auto-clustering feedbacks by topic would be an amazing feature. We have thousands of entries to organize.",
        channel: "SALES_CALL",
        customerLabel: "Enterprise Account C"
    },
    {
        content: "The sentiment analysis sometimes classifies bug reports as negative when they are just factual statements.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "We need a dashboard view showing sentiment trends per channel (e.g. Twitter vs Support Ticket).",
        channel: "SUPPORT_TICKET",
        customerLabel: "VP of Product"
    },
    {
        content: "The AI summary feature is super helpful. Saves us hours of reading through long support tickets.",
        channel: "TWITTER",
        customerLabel: "SaaS Founder"
    },
    {
        content: "Can we train the AI classifier on our custom taxonomy? 'Billing' vs 'Pricing' is a subtle difference for a general model.",
        channel: "COMMUNITY",
        customerLabel: "Product Analyst"
    },
    {
        content: "Analytics graphs are missing a filter for Customer Label. We only want to see sentiment for Enterprise users.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Enterprise Lead"
    },
    {
        content: "The AI tag suggestions are occasionally irrelevant. There should be a way to reject or override them in the UI.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "AI processing takes a long time to trigger. It sits in 'Pending' for up to 5 minutes after CSV upload.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "Is there an AI analytics endpoint we can query to get overall monthly sentiment trends?",
        channel: "SUPPORT_TICKET",
        customerLabel: "Tech Partner"
    },

    // Collaboration & Workflow
    {
        content: "We need to assign feedback items to specific team members. Right now anyone can edit anything.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Team Lead"
    },
    {
        content: "Can we add internal comments to feedback items? We want to discuss requests before changing their status.",
        channel: "COMMUNITY",
        customerLabel: "Product Designer"
    },
    {
        content: "Activity log is missing. I want to see who changed a feedback status from Under Review to Closed.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Workspace Admin"
    },
    {
        content: "Jira sync request. When we set a feedback status to IN_PROGRESS, it should create a ticket in Jira automatically.",
        channel: "SALES_CALL",
        customerLabel: "Prospective Client"
    },
    {
        content: "Users should be able to upvote existing feedbacks so we can see which requests are most popular.",
        channel: "COMMUNITY",
        customerLabel: "Community Mod"
    },
    {
        content: "Need to link multiple feedbacks together. Customers often request the same thing in slightly different ways.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Support Agent"
    },
    {
        content: "Beautiful collaboration features. The real-time updates are working perfectly.",
        channel: "TWITTER",
        customerLabel: "Design Lead"
    },
    {
        content: "Is there a way to lock a feedback item so others can't edit it while I am writing a response?",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "We need custom roles. Analysts should only be allowed to tag feedback, not delete them.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Workspace Owner"
    },
    {
        content: "Merging duplicate feedbacks should combine their theme assignments and customer labels automatically.",
        channel: "SURVEY",
        customerLabel: ""
    },

    // Login & Security
    {
        content: "Support for SAML SSO is a hard requirement for our security review. We cannot adopt LOOP without it.",
        channel: "SALES_CALL",
        customerLabel: "Security Team"
    },
    {
        content: "The login session expires too quickly. I have to log back in every hour, which is disruptive.",
        channel: "COMMUNITY",
        customerLabel: "Heavy User"
    },
    {
        content: "Multi-factor authentication (MFA) setup is missing. Our team security guidelines require this for all tools.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Security Lead"
    },
    {
        content: "Password reset emails are getting flagged as spam by Google Workspace. Please check your domain SPF/DKIM records.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "The registration page keeps throwing an error when I try to sign up with a valid email. The error message doesn't help.",
        channel: "SUPPORT_TICKET",
        customerLabel: ""
    },
    {
        content: "Is there an IP whitelist feature for workspace access control? We want to restrict logins to our office VPN.",
        channel: "SALES_CALL",
        customerLabel: "Compliance Manager"
    },
    {
        content: "Can we restrict invite links to specific domains (e.g. only allow @company.com emails to join)?",
        channel: "SUPPORT_TICKET",
        customerLabel: "HR Manager"
    },
    {
        content: "Session hijack protection or concurrent session limits would be great additions for security compliance.",
        channel: "COMMUNITY",
        customerLabel: "SecOps Analyst"
    },
    {
        content: "Password requirements are too loose. We should enforce symbol, number, and uppercase checks.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "SSO login flows redirect back to the home page instead of the path I originally bookmarked.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Partner Lead"
    },

    // General Bugs & Complaints
    {
        content: "The text editor inside the feedback detail screen keeps stripping out empty lines and formatting.",
        channel: "APP_STORE",
        customerLabel: "iOS Reviewer"
    },
    {
        content: "Clicking 'Save Changes' on edit form sometimes does nothing. No loading spinner, no error banner, just freezes.",
        channel: "PLAY_STORE",
        customerLabel: "Android User"
    },
    {
        content: "The customer label is capped at 100 characters, but the UI doesn't stop us from typing more, causing database errors on submit.",
        channel: "MANUAL",
        customerLabel: "QA Engineer"
    },
    {
        content: "Status dropdown sometimes resets to 'Submitted' after saving inline edits. Database updates but UI is wrong.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "The delete confirmation modal closes when clicking outside the dialog box. This is dangerous and can lead to accidental deletion.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Borders inside the feedback table are misaligned in dark mode. Looks like a CSS margin issue.",
        channel: "COMMUNITY",
        customerLabel: ""
    },
    {
        content: "The app crashed completely when I pasted a 10,000 character feedback. It should warn us of the limit instead.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Lead Analyst"
    },
    {
        content: "Hover tooltip on table content column is delayed by several seconds. Can we make it display instantly?",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Clicking row to view details doesn't open in a new tab when using Ctrl+Click or middle click.",
        channel: "COMMUNITY",
        customerLabel: "Developer"
    },
    {
        content: "Theme colors are not updating in real-time when custom themes are added. I have to force reload the page.",
        channel: "SUPPORT_TICKET",
        customerLabel: ""
    },

    // Praise & Success
    {
        content: "This tool has completely transformed how we handle client requests. Super clean UI and dead simple workflows.",
        channel: "TWITTER",
        customerLabel: "SaaS Founder"
    },
    {
        content: "The speed of the application is impressive. Snappiest SaaS feedback tool I've tested so far.",
        channel: "APP_STORE",
        customerLabel: "iOS User"
    },
    {
        content: "Customer labels and channels are perfect for organizing our feedback database. Very intuitive.",
        channel: "PLAY_STORE",
        customerLabel: ""
    },
    {
        content: "Beautiful design aesthetics. The subtle gradients and dark theme are premium and look amazing.",
        channel: "TWITTER",
        customerLabel: "UX Critic"
    },
    {
        content: "We imported 500 tickets in under 10 seconds. Ingestion performance is stellar.",
        channel: "SUPPORT_TICKET",
        customerLabel: "Operations Analyst"
    },
    {
        content: "So simple to onboard our support agents. Literally took them 5 minutes to learn how to log feedback.",
        channel: "COMMUNITY",
        customerLabel: "CS Manager"
    },
    {
        content: "Zidio-ProjectLoop has solved our theme aggregation bottleneck. We can easily associate requests to themes.",
        channel: "SALES_CALL",
        customerLabel: "Key Enterprise Client"
    },
    {
        content: "Love the custom validation errors on CSV upload. Makes correcting formatting errors extremely easy.",
        channel: "COMMUNITY",
        customerLabel: "Data Quality Lead"
    },
    {
        content: "Great support docs. Everything was documented perfectly, making setup a breeze.",
        channel: "SURVEY",
        customerLabel: ""
    },
    {
        content: "Best feedback client I have used. Clean, simple, fast, and does exactly what it says on the box.",
        channel: "TWITTER",
        customerLabel: "Tech Blogger"
    }
];
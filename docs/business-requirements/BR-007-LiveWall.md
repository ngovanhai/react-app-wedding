# BR-007: Live Wall Feature

## Overview
Implement a live wall feature that displays real-time updates of photos and messages from guests, creating an interactive experience during the wedding event.

## Requirements

### Functional Requirements
- **REQ-007.1**: System shall display a live feed of photos uploaded by guests
- **REQ-007.2**: System shall display real-time guest messages and well-wishes
- **REQ-007.3**: Live wall shall support real-time updates without page refresh
- **REQ-007.4**: Admin shall be able to moderate content before display
- **REQ-007.5**: System shall support filtering options (photos only, messages only, combined)
- **REQ-007.6**: Live wall shall support different display modes (grid, slideshow, timeline)
- **REQ-007.7**: System shall allow embedding the live wall on external websites
- **REQ-007.8**: Live wall shall support custom themes and styling
- **REQ-007.9**: System shall allow pinning important posts to the top

### Non-Functional Requirements
- **REQ-007.10**: Live updates should appear within 2 seconds of submission
- **REQ-007.11**: System shall handle high concurrent user loads during peak times
- **REQ-007.12**: Live wall shall be optimized for large screen displays

### Data Model
- LivePost: id, wedding_id, user_id, content_type, content, status, created_at, updated_at
- LiveWallConfig: id, wedding_id, theme, display_mode, moderation_enabled, settings

### API Endpoints
- GET /api/v1/weddings/:id/livewall - Get live wall posts
- POST /api/v1/weddings/:id/livewall - Submit post to live wall
- PUT /api/v1/weddings/:id/livewall/config - Update live wall configuration
- GET /api/v1/weddings/:id/livewall/config - Get live wall configuration
- PUT /api/v1/weddings/:id/livewall/moderate - Moderate live wall posts

### WebSocket Events
- live_post_added: New post added to live wall
- live_post_removed: Post removed from live wall
- live_post_updated: Post status changed (moderation)

## Acceptance Criteria
- Live wall updates in real-time without refresh
- Admin can moderate posts before display
- Different display modes work correctly
- Live wall can be embedded on external sites
- Performance remains stable with high traffic
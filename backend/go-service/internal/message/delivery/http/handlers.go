package http

import (
	"init-src/pkg/response"

	"github.com/gin-gonic/gin"
)

// send godoc
// @Summary      Send a message
// @Description  Send a new message to a conversation
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        id  			  path      string   true  "Conversation ID"
// @Param        body             body      sendReq  true  "Message content"
// @Success      200              {object}  response.Response{data=detailResp}
// @Failure      400              {object}  response.Response
// @Failure      403              {object}  response.Response
// @Failure      404              {object}  response.Response
// @Router       /conversations/{id}/messages [post]
func (h handler) send(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, err := h.processSendRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "message.handler.send.processSendRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	msg, err := h.uc.Send(ctx, sc, req.toInput(conversationID))
	if err != nil {
		h.l.Warnf(ctx, "message.handler.send.uc.Send: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(msg))
}

// list godoc
// @Summary      List messages (deprecated)
// @Description  List messages in a conversation (use Get endpoint instead for pagination)
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        id  			  path      string  true  "Conversation ID"
// @Param        min_seq          query     int     false "Minimum sequence number"
// @Param        max_seq          query     int     false "Maximum sequence number"
// @Success      200              {object}  response.Response{data=[]detailResp}
// @Failure      400              {object}  response.Response
// @Failure      403              {object}  response.Response
// @Router       /conversations/{id}/messages [get]
func (h handler) list(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, err := h.processGetRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "message.handler.list.processGetRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	pagin := extractPaginatorQuery(c)
	out, err := h.uc.Get(ctx, sc, req.toInput(conversationID, pagin))
	if err != nil {
		h.l.Warnf(ctx, "message.handler.list.uc.Get: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetResponse(out.Messages, out.Pagin))
}

// findByID godoc
// @Summary      Get message by ID
// @Description  Get a specific message by its ID
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        id  path      string  true  "Conversation ID"
// @Param        message_id       path      string  true  "Message ID"
// @Success      200              {object}  response.Response{data=GetByIDResponse}
// @Failure      400              {object}  response.Response
// @Failure      403              {object}  response.Response
// @Failure      404              {object}  response.Response
// @Router       /conversations/{id}/messages/{message_id} [get]
func (h handler) findByID(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, err := h.processFindByIDRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "message.handler.findByID.processFindByIDRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	out, err := h.uc.GetOne(ctx, sc, req.toInput(conversationID))
	if err != nil {
		h.l.Warnf(ctx, "message.handler.findByID.uc.GetOne: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newGetByIDResponse(out.Message))
}

// edit godoc
// @Summary      Edit a message
// @Description  Edit an existing message (only by sender, cannot edit system messages)
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        id  			  path      string   true  "Conversation ID"
// @Param        message_id       path      string   true  "Message ID"
// @Param        body             body      editReq  true  "New message content"
// @Success      200              {object}  response.Response{data=detailResp}
// @Failure      400              {object}  response.Response
// @Failure      403              {object}  response.Response
// @Failure      404              {object}  response.Response
// @Router       /conversations/{id}/messages/{message_id} [put]
func (h handler) edit(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, messageID, err := h.processEditRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "message.handler.edit.processEditRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	msg, err := h.uc.Edit(ctx, sc, req.toInput(conversationID, messageID))
	if err != nil {
		h.l.Warnf(ctx, "message.handler.edit.uc.Edit: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDetailResp(msg))
}

// delete godoc
// @Summary      Delete a message
// @Description  Delete a message (only by sender, soft delete)
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        id  			  path      string  true  "Conversation ID"
// @Param        message_id       path      string  true  "Message ID"
// @Success      200              {object}  response.Response{data=deleteResp}
// @Failure      400              {object}  response.Response
// @Failure      403              {object}  response.Response
// @Failure      404              {object}  response.Response
// @Router       /conversations/{id}/messages/{message_id} [delete]
func (h handler) delete(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, err := h.processDeleteRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "message.handler.delete.processDeleteRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	result, err := h.uc.Delete(ctx, sc, req.toInput(conversationID))
	if err != nil {
		h.l.Warnf(ctx, "message.handler.delete.uc.Delete: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newDeleteResp(result))
}

// search godoc
// @Summary      Search messages in conversation
// @Description  Full-text search for messages within a specific conversation
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        id  			  path      string  true   "Conversation ID"
// @Param        q                query     string  true   "Search query"
// @Success      200              {object}  response.Response{data=SearchResponse}
// @Failure      400              {object}  response.Response
// @Failure      403              {object}  response.Response
// @Router       /conversations/{id}/messages/search [get]
func (h handler) search(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, conversationID, err := h.processSearchRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "message.handler.search.processSearchRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	messages, err := h.uc.Search(ctx, sc, req.toInput(conversationID))
	if err != nil {
		h.l.Warnf(ctx, "message.handler.search.uc.Search: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newSearchResponse(messages))
}

// searchGlobal godoc
// @Summary      Search messages globally
// @Description  Full-text search across all conversations user is part of
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        q    query     string  true  "Search query"
// @Success      200  {object}  response.Response{data=SearchResponse}
// @Failure      400  {object}  response.Response
// @Router       /messages/search [get]
func (h handler) searchGlobal(c *gin.Context) {
	ctx := c.Request.Context()

	req, sc, err := h.processSearchGlobalRequest(c)
	if err != nil {
		h.l.Warnf(ctx, "message.handler.searchGlobal.processSearchGlobalRequest: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	messages, err := h.uc.SearchGlobal(ctx, sc, req.toInput())
	if err != nil {
		h.l.Warnf(ctx, "message.handler.searchGlobal.uc.SearchGlobal: %s", err)
		mapErr := h.mapError(err)
		response.Error(c, mapErr)
		return
	}

	response.OK(c, h.newSearchResponse(messages))
}

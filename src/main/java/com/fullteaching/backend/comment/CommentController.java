package com.fullteaching.backend.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.entry.Entry;
import com.fullteaching.backend.entry.EntryRepository;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/api-comments")
public class CommentController {
	
	@Autowired
	private EntryRepository entryRepository;
	
	@Autowired
	private CommentRepository commentRepository;
	
	@Autowired
	private UserComponent user;
	
	@RequestMapping(value = "/entry/{entryId}/forum/{courseDetailsId}", method = RequestMethod.POST)
	public ResponseEntity<Object> newComment(
			@RequestBody Comment comment, 
			@PathVariable(value="entryId") String entryId, 
			@PathVariable(value="courseDetailsId") String courseDetailsId
	) {
		
		long id_entry = -1;
		try {
			id_entry = Long.parseLong(entryId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
				
		//Setting the author of the comment
		User userLogged = user.getLoggedUser();
		comment.setUser(userLogged);
		//Setting the date of the comment
		comment.setDate(System.currentTimeMillis());
		
		//The comment is a root comment
		if (comment.getCommentParent() == null){
			Entry entry = entryRepository.findOne(id_entry);
			if(entry != null){
				entry.getComments().add(comment);
				/*Saving the modified entry: Cascade relationship between entry and comments
				  will add the new comment to CommentRepository*/
				entryRepository.save(entry);
				/*Entire entry is returned*/
				return new ResponseEntity<>(entry, HttpStatus.CREATED);
			}else{
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
		
		// The comment is a replay to another existing comment
		else{
			Comment cParent = commentRepository.findOne(comment.getCommentParent().getId());
			if(cParent != null){
				cParent.getReplies().add(comment);
				/*Saving the modified parent comment: Cascade relationship between comment and 
				 its replies will add the new comment to CommentRepository*/
				commentRepository.save(cParent);
				Entry entry = entryRepository.findOne(id_entry);
				/*Entire entry is returned*/
				return new ResponseEntity<>(entry, HttpStatus.CREATED);
			} else {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
	}

}
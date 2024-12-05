package com.server.post.repository;

import com.server.post.model.Post;
import com.server.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByAuthor(User author);

    List<Post> findByAuthor_Username(String username);
}


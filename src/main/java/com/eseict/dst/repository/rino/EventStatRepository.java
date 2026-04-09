package com.eseict.dst.repository.rino;

import com.eseict.dst.domain.entity.rino.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventStatRepository extends JpaRepository<Event, String> {
}

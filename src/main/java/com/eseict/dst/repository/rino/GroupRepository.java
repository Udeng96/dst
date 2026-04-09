package com.eseict.dst.repository.rino;

import com.eseict.dst.domain.entity.rino.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, String> {
}

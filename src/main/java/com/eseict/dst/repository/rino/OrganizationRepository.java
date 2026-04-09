package com.eseict.dst.repository.rino;

import com.eseict.dst.domain.entity.rino.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {
}

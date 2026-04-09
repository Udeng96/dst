package com.eseict.dst.service.organization;

import com.eseict.dst.domain.entity.rino.Organization;
import com.eseict.dst.repository.rino.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<Organization> getOrganizations() {
        return organizationRepository.findAll();
    }
}

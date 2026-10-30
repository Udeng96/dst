# Security cleanup

Internal connection examples and fixed credentials were removed from the latest source. Real connection settings and credentials must be supplied separately. Existing commit history was preserved; previously exposed values are not revoked by this change. Rotate any credentials still in use.

The frontend previously passed its build. Backend compilation requires the private common library, which is not included. Company artifact repository URLs were removed; no substitute implementation was added.

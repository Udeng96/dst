package com.eseict.dst.repository.user

import com.eseict.dst.domain.entity.rino.User
import com.eseict.dst.repository.rino.UserRepository
import com.google.gson.Gson
import org.junit.jupiter.api.Test
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(
    properties = [
        "spring.config.location=" +
                "file:\${DST_HOME}/properties/application.yml" +
                ", file:\${DST_HOME}/properties/config.yml" +
                ", file:\${DST_HOME}/properties/database.yml" +
                ", file:\${DST_HOME}/properties/api.yml"
    ]
)
internal class UserRepositoryTest{
    val logger:Logger = LoggerFactory.getLogger(UserRepositoryTest::class.java)

    @Autowired
    private lateinit var userRepository: UserRepository

    @Test
    fun compareFindAllFindAllProjected() {
        val users:List<User> = userRepository.findAll()
        val projectedUsers:List<UserRepository.UserFiltered> = userRepository.findAllUserFilteredBy()

        val gson = Gson()

        logger.info("findAll() START ================")
        users.forEach{
            logger.info("USER INFO : {}", gson.toJson(it))
        }
        logger.info("findAll() FINISH ================")

        logger.info("findAllProjected() START ================")
        projectedUsers.forEach{
//            logger.info("USER INFO : {}", it.))
//            logger.info("USER INFO : {}", gson.toJson(it, UserRepository.UserFiltered::class.java))
        }
        logger.info("findAllProjected() FINISH ================")

    }

}
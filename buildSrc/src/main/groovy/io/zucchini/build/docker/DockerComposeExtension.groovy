package io.zucchini.build.docker

import groovy.transform.PackageScope
import org.gradle.api.Project
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.Optional


class DockerComposeExtension {

    @Input
    @Optional
    Map<String, String> env = [:]

    DockerComposeExtension(Project project) {
        // Project not used for now, required by Gradle runtime
    }

    void environment(String name, String value) {
        System.stdout.println("Adding ${name} with value ${value}");
        env.put(name, value)
    }

    void environment(Map<String, String> otherEnv) {
        env.putAll(otherEnv)
    }

}

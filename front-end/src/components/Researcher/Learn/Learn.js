import React from 'react';

export default function Learn() {
  return (
    <div className="h-full pt-6 pl-12 pr-12">
      <h3 className="text-gray-200 uppercase">Learn</h3>
      <p className="pt-4 text-gray-200 border-b">
        The purpose of this document is to lay out the content that will fill the LEARN section of the FETT-Portal. This content is expected to mature
        and evolve over time, and may see updates during the contest itself.
      </p>
      <p className="pt-4 text-gray-200">
        This information is provided to help set context and give focus to researchers participating in this bug bounty event.
      </p>
      <p className="pt-4 text-gray-200">
        The processors under examination here can be assumed to be in compliance with the GFE specification, outlined here. This GFE documentation has
        concrete specifications for the processors commonly referred to as “P1”, “P2”, and “P3” in subsequent documentation under the chapter title
        “Processor Specifications.”
      </p>

      <div className="pt-6">
        <h2 className="text-gray-200 text-lg font-normal">Quickstart </h2>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          You can use this website to provision new instances of the various platform combinations and receive credentials and connection information
          for each
        </p>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          NOTE: You will be limited to a maximum of two (2) active instances at any given time, though instances can be paused and restarted from this
          interface.
        </p>
      </div>

      <div className="pt-6">
        <h2 className="text-gray-200 text-lg font-normal">SSITH Processors</h2>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          Cambridge/SRI CPU: Bluespec CHERI-RISC-V OS: CheriBSD Applications: Web Server (nginx v.1.13.12) Database (sqlite v.3.22.0) SSH Daemon
          (OpenSSH 7.3) Lockheed Martin Corporation CPU: Chisel P1 OS: FreeRTOS Applications: HTTP Server OTA CPU: Chisel P2 OS: Debian Linux
          Applications: Web Server (nginx v.1.13.12) Database (SQLite v.3.22.0) SSH Daemon (OpenSSH 7.3) University of Michigan MORPHEUS CPU CPU:
          Chisel P1 w/no MMU use (64-bit physical memory processor) OS: FreeRTOS Applications: Minnow web server (version?) Database (SQLite v.3.22.0)
          Medical database application (TBD more info available here?) MIT CPU: Bluespec P2 OS: Debian Linux Applications: Web Server (Nginx
          v.1.13.12) Database (SQLite v.3.22.0) SSH Daemon (OpenSSH 7.3)
        </p>
      </div>

      <div className="pt-6">
        <h2 className="text-gray-200 text-lg font-normal">Technical descriptions of SSITH security technologies</h2>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          The target platform is a RISC-V CPU/SoC running Linux, FreeBSD, or FreeRTOS. More details about the underlying hardware, firmware, and
          software platform is found in the GFE project at GitHub. MORPHEUS (University of Michigan) 1 page PDF on MORPHEUS Sanctum/Sanctorum (MIT) 1
          page PDF on Sanctum/Sanctorum HARD pipelines (LMCO) 1 page PDF on LMCO HARD CHERI (University of Cambridge / SRI) 1 page PDF on CHERI
        </p>
      </div>

      <div className="pt-6">
        <h2 className="text-gray-200 text-lg font-normal">Application source code and configuration files</h2>
        <p className="text-gray-200 text-sm leading-tight pt-2">TBD - links to public repos for application payloads?</p>
      </div>

      <div className="pt-6">
        <h2 className="text-gray-200 text-lg font-normal">FETT-Voting</h2>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          Application Description: This application represents the minimum demonstrable implementation of a Voter Registration application, intended
          to run on SSITH hardware. An actual production Voter Registration system would have a significantly larger footprint; among other
          implementation choices, it would be implemented with a more full-featured DBMS than SQLite. The application enables users to submit
          registration information and to upload image files intended to contain proof of identity and right to vote. It also enables election
          officials to promote pending voter registrations to active voter registrations, and to modify the voter registration database in various
          ways. In keeping with the real-world threats against voter registration systems, the primary threats we consider in scope for FETT are
          unauthorized disclosure of voter registration information, and unauthorized modification or deletion of voter registration information. In
          particular, because voter registrations are typically public information, unauthorized disclosure is defined as one of the following that
          occurs while not properly authenticated to the system as an election official:: Disclosure of the proof of identity used by any voter at
          registration time Disclosure of any part of a voter registration record that is marked “confidential”, including the fact of its existence
          Unauthorized modification or deletion includes any change to voter registration records that occurs while not properly authenticated to the
          system as an election official, except that a voter whose record is not marked “confidential” can modify their own record (after which it
          becomes a pending registration) by authenticating to the system with their existing registration information (including the original proof
          of identity they submitted). Direct modification/viewing of the SQLite database file for the voter registration system from the command line
          is explicitly out of scope. FETT researchers have unrestricted access to the filesystem, and the encryption and key management associated
          with protecting the registration database at rest from such unrestricted access have significant overhead that is not reasonable for either
          the FPGA-based implementation platform or for the FETT competition.
        </p>
      </div>
    </div>
  );
}

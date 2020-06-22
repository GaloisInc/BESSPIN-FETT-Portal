import React from 'react';

export default function Learn() {
  return (
    <div className="h-full pt-6 pl-12 pr-12 pb-12">
      <h3 className="text-gray-200 uppercase">Learn</h3>
      <p className="pt-4 text-gray-200">
        This information is provided to help set context and give focus to researchers participating in this bug bounty event.
      </p>
      <p className="pt-4 pb-4 text-gray-200 border-b">
        The processors under examination here can be assumed to be in compliance with the GFE specification, outlined{' '}
        <a
          href="https://github.com/GaloisInc/BESSPIN-GFE-2019/blob/master/GFE_Rel4_System_Description.pdf"
          target="_blank"
          className="text-teal-400 underline"
          rel="noopener noreferrer"
        >
          here
        </a>
        . This GFE documentation has concrete specifications for the processors commonly referred to as “P1”, “P2”, and “P3” in subsequent
        documentation under the chapter title “Processor Specifications.”
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
          Cambridge/SRI
          <ul className="list-disc list-inside pl-4">
            <li>
              CPU: Bluespec CHERI-RISC-V
              <ul className="list-disc list-inside pl-6">
                <li>
                  OS:{' '}
                  <a
                    href="https://www.cl.cam.ac.uk/research/security/ctsrd/cheri/cheribsd.html"
                    target="_blank"
                    className="text-teal-400 underline"
                    rel="noopener noreferrer"
                  >
                    CheriBSD
                  </a>
                </li>
                <li>
                  Applications:
                  <ul className="list-disc list-inside pl-8">
                    <li>Web Server (nginx v.1.13.12)</li>
                    <li>Database (sqlite v.3.22.0)</li>
                    <li>SSH Daemon (OpenSSH 7.3)</li>
                    <li>Voting registration application</li>
                    <li>Additional applications modified to incorporate CHERI protections</li>
                    <li>Researcher-provided and compiled vulnerable applications</li>
                  </ul>
                </li>
                <li>Security researchers are given access to an unprivileged shell to interact with custom applications</li>
              </ul>
            </li>
            <li>FAQ forthcoming if required based on contest activity</li>
          </ul>
        </p>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          Lockheed Martin Corporation
          <ul className="list-disc list-inside pl-4">
            <li>
              CPU: Chisel P1
              <ul className="list-disc list-inside pl-6">
                <li>
                  OS:{' '}
                  <a
                    href="https://freertos.org/://www.cl.cam.ac.uk/research/security/ctsrd/cheri/cheribsd.html"
                    target="_blank"
                    className="text-teal-400 underline"
                    rel="noopener noreferrer"
                  >
                    FreeRTOS
                  </a>
                </li>
                <li>
                  Applications:
                  <ul className="list-disc list-inside pl-8">
                    <li>HTTP Server</li>
                    <li>OTA update server</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              CPU: Chisel P2
              <ul className="list-disc list-inside pl-6">
                <li>OS: Debian Linux 10.0</li>
                <li>
                  Applications:
                  <ul className="list-disc list-inside pl-8">
                    <li>Web Server (nginx v.1.13.12)</li>
                    <li>Database (SQLite v3.22.0)</li>
                    <li>SSH Daemon (OpenSSH 7.3)</li>
                    <li>Custom ‘hackme’ application</li>
                    <li>Voting registration application</li>
                    <li>Researcher-provided and compiled vulnerable applications</li>
                  </ul>
                </li>
                <li>Security researchers are given access to an unprivileged shell to interact with custom applications</li>
              </ul>
            </li>
            <li>FAQ forthcoming if required based on contest activity</li>
          </ul>
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          University of Michigan MORPHEUS CPU
          <ul className="list-disc list-inside pl-4">
            <li>
              CPU: Chisel P1 w/no MMU use (64-bit physical memory processor)
              <ul className="list-disc list-inside pl-6">
                <li>
                  OS:{' '}
                  <a
                    href="https://freertos.org/://www.cl.cam.ac.uk/research/security/ctsrd/cheri/cheribsd.html"
                    target="_blank"
                    className="text-teal-400 underline"
                    rel="noopener noreferrer"
                  >
                    FreeRTOS
                  </a>
                </li>
                <li>
                  Applications:
                  <ul className="list-disc list-inside pl-8">
                    <li>Database (SQLite v3.31.1)</li>
                    <li>Medical database application (uses SQLite v3.31.1 and latest FreeRTOS + modified TCP stack)</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>FAQ forthcoming if required based on contest activity</li>
          </ul>
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          MIT
          <ul className="list-disc list-inside pl-4">
            <li>
              CPU: Bluespec P2
              <ul className="list-disc list-inside pl-6">
                <li>OS: Debian Linux</li>
                <li>
                  Applications:
                  <ul className="list-disc list-inside pl-8">
                    <li>Web Server (Nginx v1.13.12)</li>
                    <li>Database (SQLite v3.22.0)</li>
                    <li>SSH Daemon (OpenSSH v7.3)</li>
                    <li>Protected AES engine</li>
                    <li>Protected Password Authentication Module</li>
                    <li>Protected nginx authentication module</li>
                  </ul>
                </li>
                <li>Security researchers given access to a root shell on system</li>
              </ul>
            </li>
            <li>FAQ forthcoming if required based on contest activity</li>
          </ul>
        </p>
      </div>

      <div className="pt-6">
        <h2 className="text-gray-200 text-lg font-normal">Technical descriptions of SSITH security technologies</h2>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          The target platform is a RISC-V CPU/SoC running Linux, FreeBSD, or FreeRTOS. More details about the underlying hardware, firmware, and
          software platform is found in the{' '}
          <a href="https://github.com/GaloisInc/BESSPIN-GFE-2019/" target="_blank" className="text-teal-400 underline" rel="noopener noreferrer">
            GFE project at GitHub
          </a>
          .
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          <a href="https://dl.acm.org/doi/10.1145/3297858.3304037" target="_blank" className="text-teal-400 underline" rel="noopener noreferrer">
            MORPHEUS
          </a>{' '}
          (University of Michigan)
          <br />
          <a
            href="https://drive.google.com/open?id=1ya_NSY5_WrWFuVsEEWNzo4_IW_6AjcDb"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            1 page PDF on MORPHEUS
          </a>
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          <a href="https://eprint.iacr.org/2015/564.pdf" target="_blank" rel="noopener noreferrer">
            Sanctum/Sanctorum
          </a>{' '}
          (MIT) <br />
          <a
            href="https://drive.google.com/drive/folders/10SCCQu-VJHie0BYZVBr3Qpsq_Xc63lhl"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            1 page PDF on Sanctum/Sanctorum
          </a>
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          HARD pipelines (LMCO) <br />
          <a
            href="https://drive.google.com/open?id=1G79hDcRCc7RgnUXjTHeSnRbJvH2l1zfO"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            1 page PDF on LMCO HARD
          </a>
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          <a
            href="https://www.cl.cam.ac.uk/research/security/ctsrd/cheri/"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            CHERI
          </a>{' '}
          (University of Cambridge / SRI) <br />
          <a
            href="https://drive.google.com/drive/folders/10fFQ8vMvww_4r9OQxIt0QMpR5OVNTeeJ"
            target="_blank"
            className="text-teal-400 underline"
            rel="noopener noreferrer"
          >
            1 page PDF on CHERI
          </a>
        </p>
      </div>

      <div className="pt-6">
        <h2 className="text-gray-200 text-lg font-normal">FETT-Voting</h2>
        <p className="text-gray-200 text-sm leading-tight pt-2">
          Application Description: This application represents the minimum demonstrable implementation of a Voter Registration application, intended
          to run on SSITH hardware. An actual production Voter Registration system would have a significantly larger footprint; among other
          implementation choices, it would be implemented with a more full-featured DBMS than SQLite. The application enables users to submit
          registration information and to upload image files intended to contain proof of identity and right to vote. It also enables election
          officials to promote pending voter registrations to active voter registrations, and to modify the voter registration database in various
          ways.
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          In keeping with the real-world threats against voter registration systems, the primary threats we consider in scope for FETT are
          unauthorized disclosure of voter registration information, and unauthorized modification or deletion of voter registration information. In
          particular, because voter registrations are typically public information, unauthorized disclosure is defined as one of the following that
          occurs while not properly authenticated to the system as an election official::
          <ul className="list-disc list-inside pl-4">
            <li>Disclosure of the proof of identity used by any voter at registration time</li>
            <li>Disclosure of any part of a voter registration record that is marked “confidential”, including the fact of its existence</li>
          </ul>
          Unauthorized modification or deletion includes any change to voter registration records that occurs while not properly authenticated to the
          system as an election official, except that a voter whose record is not marked “confidential” can modify their own record (after which it
          becomes a pending registration) by authenticating to the system with their existing registration information (including the original proof
          of identity they submitted).
        </p>

        <p className="text-gray-200 text-sm leading-tight pt-2">
          Direct modification/viewing of the SQLite database file for the voter registration system from the command line is explicitly out of scope.
          FETT researchers have unrestricted access to the filesystem, and the encryption and key management associated with protecting the
          registration database at rest from such unrestricted access have significant overhead that is not reasonable for either the FPGA-based
          implementation platform or for the FETT competition.
        </p>
      </div>
    </div>
  );
}
